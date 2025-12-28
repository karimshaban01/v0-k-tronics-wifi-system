import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { generateVoucherCode } from "@/lib/voucher-generator"
import { getCurrentUser } from "@/lib/auth"
import type { Voucher, SystemSetting } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { package_id, quantity = 1 } = await request.json()

    if (!package_id || quantity < 1 || quantity > 100) {
      return NextResponse.json({ success: false, error: "Invalid package_id or quantity (max 100)" }, { status: 400 })
    }

    // Get voucher prefix from settings
    const prefixSetting = await queryOne<SystemSetting>(
      "SELECT setting_value FROM system_settings WHERE setting_key = ?",
      ["voucher_code_prefix"],
    )
    const prefix = prefixSetting?.setting_value || "KT"

    // Generate vouchers
    const vouchers: Voucher[] = []
    for (let i = 0; i < quantity; i++) {
      const voucherCode = generateVoucherCode(prefix)

      await query("INSERT INTO vouchers (voucher_code, package_id, status, created_by) VALUES (?, ?, 'available', ?)", [
        voucherCode,
        package_id,
        user.id,
      ])

      const newVoucher = await queryOne<Voucher>("SELECT * FROM vouchers WHERE voucher_code = ?", [voucherCode])
      if (newVoucher) vouchers.push(newVoucher)
    }

    // Log audit
    await query("INSERT INTO audit_logs (admin_user_id, action, table_name, new_values) VALUES (?, ?, ?, ?)", [
      user.id,
      "generate_vouchers",
      "vouchers",
      JSON.stringify({ package_id, quantity }),
    ])

    return NextResponse.json({
      success: true,
      data: vouchers,
    })
  } catch (error) {
    console.error("[v0] Error generating vouchers:", error)
    return NextResponse.json({ success: false, error: "Failed to generate vouchers" }, { status: 500 })
  }
}
