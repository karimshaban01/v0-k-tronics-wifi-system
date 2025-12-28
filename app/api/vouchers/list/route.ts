import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const packageId = searchParams.get("package_id")
    const search = searchParams.get("search")

    let sql = `
      SELECT v.*, p.package_name, p.price 
      FROM vouchers v 
      JOIN packages p ON v.package_id = p.id 
      WHERE 1=1
    `
    const params: any[] = []

    if (status) {
      sql += " AND v.status = ?"
      params.push(status)
    }

    if (packageId) {
      sql += " AND v.package_id = ?"
      params.push(packageId)
    }

    if (search) {
      sql += " AND (v.voucher_code LIKE ? OR v.phone_number LIKE ?)"
      params.push(`%${search}%`, `%${search}%`)
    }

    sql += " ORDER BY v.created_at DESC LIMIT 500"

    const vouchers = await query(sql, params)

    return NextResponse.json({ success: true, data: vouchers })
  } catch (error) {
    console.error("[v0] Error fetching vouchers:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch vouchers" }, { status: 500 })
  }
}
