import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Package } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { package_name, description, data_limit_mb, speed_limit_kbps, validity_hours, price, currency, is_active } =
      await request.json()

    if (!package_name || !data_limit_mb || !validity_hours || !price) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    await query(
      `INSERT INTO packages 
       (package_name, description, data_limit_mb, speed_limit_kbps, validity_hours, price, currency, is_active, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        package_name,
        description,
        data_limit_mb,
        speed_limit_kbps,
        validity_hours,
        price,
        currency || "TZS",
        is_active !== false,
        user.id,
      ],
    )

    const newPackage = await queryOne<Package>("SELECT * FROM packages WHERE id = LAST_INSERT_ID()")

    // Log audit
    await query("INSERT INTO audit_logs (admin_user_id, action, table_name, new_values) VALUES (?, ?, ?, ?)", [
      user.id,
      "create_package",
      "packages",
      JSON.stringify({ package_name, price }),
    ])

    return NextResponse.json({ success: true, data: newPackage })
  } catch (error) {
    console.error("[v0] Error creating package:", error)
    return NextResponse.json({ success: false, error: "Failed to create package" }, { status: 500 })
  }
}
