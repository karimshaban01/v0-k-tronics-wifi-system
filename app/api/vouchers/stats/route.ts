import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const stats = await query<any>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
        SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold,
        SUM(CASE WHEN status = 'activated' THEN 1 ELSE 0 END) as activated,
        SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired,
        SUM(CASE WHEN status = 'revoked' THEN 1 ELSE 0 END) as revoked
      FROM vouchers
    `)

    return NextResponse.json({ success: true, data: stats[0] })
  } catch (error) {
    console.error("[v0] Error fetching voucher stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}
