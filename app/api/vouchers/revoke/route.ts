import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { voucher_id } = await request.json()

    if (!voucher_id) {
      return NextResponse.json({ success: false, error: "Voucher ID is required" }, { status: 400 })
    }

    await query("UPDATE vouchers SET status = 'revoked' WHERE id = ?", [voucher_id])

    // Log audit
    await query("INSERT INTO audit_logs (admin_user_id, action, table_name, record_id) VALUES (?, ?, ?, ?)", [
      user.id,
      "revoke_voucher",
      "vouchers",
      voucher_id,
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error revoking voucher:", error)
    return NextResponse.json({ success: false, error: "Failed to revoke voucher" }, { status: 500 })
  }
}
