import { NextResponse } from "next/server"
import { queryOne } from "@/lib/db"
import type { Voucher } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const { voucher_code } = await request.json()

    if (!voucher_code) {
      return NextResponse.json({ success: false, error: "Voucher code is required" }, { status: 400 })
    }

    const voucher = await queryOne<Voucher & { package_name: string; validity_hours: number }>(
      `SELECT v.*, p.package_name, p.validity_hours 
       FROM vouchers v 
       JOIN packages p ON v.package_id = p.id 
       WHERE v.voucher_code = ?`,
      [voucher_code],
    )

    if (!voucher) {
      return NextResponse.json({ success: false, error: "Invalid voucher code" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        voucher_code: voucher.voucher_code,
        status: voucher.status,
        package_name: voucher.package_name,
        validity_hours: voucher.validity_hours,
        purchased_at: voucher.purchased_at,
        activated_at: voucher.activated_at,
        expires_at: voucher.expires_at,
      },
    })
  } catch (error) {
    console.error("[v0] Error checking voucher:", error)
    return NextResponse.json({ success: false, error: "Failed to check voucher" }, { status: 500 })
  }
}
