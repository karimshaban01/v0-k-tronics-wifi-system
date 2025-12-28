import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get active vouchers with usage data
    const activeUsers = await query<any>(`
      SELECT 
        v.voucher_code,
        v.phone_number,
        v.pfsense_username,
        v.activated_at,
        v.expires_at,
        p.package_name,
        p.data_limit_mb,
        COALESCE(SUM(vu.bytes_uploaded + vu.bytes_downloaded), 0) as total_bytes_used
      FROM vouchers v
      JOIN packages p ON v.package_id = p.id
      LEFT JOIN voucher_usage vu ON v.id = vu.voucher_id
      WHERE v.status = 'activated' AND v.expires_at > NOW()
      GROUP BY v.id
      ORDER BY v.activated_at DESC
    `)

    return NextResponse.json({ success: true, data: activeUsers })
  } catch (error) {
    console.error("[v0] Error fetching active users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch active users" }, { status: 500 })
  }
}
