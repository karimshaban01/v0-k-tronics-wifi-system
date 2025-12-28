import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { createPfsenseUser } from "@/lib/pfsense"
import type { Voucher, Package } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const { voucher_code, mac_address } = await request.json()

    if (!voucher_code) {
      return NextResponse.json({ success: false, error: "Voucher code is required" }, { status: 400 })
    }

    // Get voucher and package details
    const voucher = await queryOne<Voucher & Package>(
      `SELECT v.*, p.* 
       FROM vouchers v 
       JOIN packages p ON v.package_id = p.id 
       WHERE v.voucher_code = ?`,
      [voucher_code],
    )

    if (!voucher) {
      return NextResponse.json({ success: false, error: "Voucher not found" }, { status: 404 })
    }

    if (voucher.status !== "sold") {
      return NextResponse.json(
        { success: false, error: `Voucher cannot be activated. Current status: ${voucher.status}` },
        { status: 400 },
      )
    }

    // Calculate expiration
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + voucher.validity_hours)

    // Create pfSense user
    try {
      const pfsenseResult = await createPfsenseUser(voucher, {
        validity_hours: voucher.validity_hours,
        data_limit_mb: voucher.data_limit_mb,
        speed_limit_kbps: voucher.speed_limit_kbps,
      } as Package)

      // Update voucher status
      await query(
        `UPDATE vouchers 
         SET status = 'activated', activated_at = NOW(), expires_at = ?, mac_address = ?, pfsense_username = ? 
         WHERE id = ?`,
        [expiresAt, mac_address || null, pfsenseResult.username, voucher.id],
      )

      return NextResponse.json({
        success: true,
        data: {
          voucher_code,
          status: "activated",
          expires_at: expiresAt,
          username: pfsenseResult.username,
        },
      })
    } catch (error) {
      console.error("[v0] pfSense activation error:", error)
      return NextResponse.json({ success: false, error: "Failed to activate voucher in pfSense" }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Error activating voucher:", error)
    return NextResponse.json({ success: false, error: "Failed to activate voucher" }, { status: 500 })
  }
}
