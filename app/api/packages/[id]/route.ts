import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Package } from "@/lib/types"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const pkg = await queryOne<Package>("SELECT * FROM packages WHERE id = ?", [id])

    if (!pkg) {
      return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: pkg })
  } catch (error) {
    console.error("[v0] Error fetching package:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch package" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { package_name, description, data_limit_mb, speed_limit_kbps, validity_hours, price, is_active } =
      await request.json()

    await query(
      `UPDATE packages 
       SET package_name = ?, description = ?, data_limit_mb = ?, speed_limit_kbps = ?, 
           validity_hours = ?, price = ?, is_active = ?, updated_at = NOW() 
       WHERE id = ?`,
      [package_name, description, data_limit_mb, speed_limit_kbps, validity_hours, price, is_active, id],
    )

    // Log audit
    await query(
      "INSERT INTO audit_logs (admin_user_id, action, table_name, record_id, new_values) VALUES (?, ?, ?, ?, ?)",
      [user.id, "update_package", "packages", id, JSON.stringify({ package_name, price, is_active })],
    )

    const updatedPackage = await queryOne<Package>("SELECT * FROM packages WHERE id = ?", [id])

    return NextResponse.json({ success: true, data: updatedPackage })
  } catch (error) {
    console.error("[v0] Error updating package:", error)
    return NextResponse.json({ success: false, error: "Failed to update package" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if package has vouchers
    const voucherCount = await queryOne<{ count: number }>(
      "SELECT COUNT(*) as count FROM vouchers WHERE package_id = ?",
      [id],
    )

    if (voucherCount && voucherCount.count > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete package with existing vouchers. Deactivate it instead." },
        { status: 400 },
      )
    }

    await query("DELETE FROM packages WHERE id = ?", [id])

    // Log audit
    await query("INSERT INTO audit_logs (admin_user_id, action, table_name, record_id) VALUES (?, ?, ?, ?)", [
      user.id,
      "delete_package",
      "packages",
      id,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting package:", error)
    return NextResponse.json({ success: false, error: "Failed to delete package" }, { status: 500 })
  }
}
