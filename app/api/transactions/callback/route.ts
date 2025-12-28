import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { generateVoucherCode } from "@/lib/voucher-generator"
import type { Transaction, SystemSetting } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const callbackData = await request.json()
    const { transaction_reference, status, provider_transaction_id } = callbackData

    if (!transaction_reference) {
      return NextResponse.json({ success: false, error: "Transaction reference is required" }, { status: 400 })
    }

    // Get transaction
    const transaction = await queryOne<Transaction>("SELECT * FROM transactions WHERE transaction_reference = ?", [
      transaction_reference,
    ])

    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 })
    }

    // Update transaction
    await query(
      `UPDATE transactions 
       SET status = ?, provider_transaction_id = ?, callback_data = ?, callback_received_at = NOW() 
       WHERE id = ?`,
      [
        status === "success" ? "completed" : "failed",
        provider_transaction_id,
        JSON.stringify(callbackData),
        transaction.id,
      ],
    )

    // If payment successful, generate voucher
    if (status === "success") {
      const prefixSetting = await queryOne<SystemSetting>(
        "SELECT setting_value FROM system_settings WHERE setting_key = ?",
        ["voucher_code_prefix"],
      )
      const prefix = prefixSetting?.setting_value || "KT"
      const voucherCode = generateVoucherCode(prefix)

      // Get package from transaction
      const pkg = await queryOne<any>("SELECT p.* FROM packages p JOIN transactions t ON t.id = ? LIMIT 1", [
        transaction.id,
      ])

      if (pkg) {
        await query(
          `INSERT INTO vouchers 
           (voucher_code, package_id, status, purchase_reference, phone_number, payment_provider, amount_paid, purchased_at) 
           VALUES (?, ?, 'sold', ?, ?, ?, ?, NOW())`,
          [
            voucherCode,
            pkg.id,
            transaction_reference,
            transaction.phone_number,
            transaction.payment_provider,
            transaction.amount,
          ],
        )

        // Update transaction with voucher
        await query(
          "UPDATE transactions SET voucher_id = (SELECT id FROM vouchers WHERE voucher_code = ?) WHERE id = ?",
          [voucherCode, transaction.id],
        )

        return NextResponse.json({
          success: true,
          data: {
            voucher_code: voucherCode,
            transaction_reference,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error processing callback:", error)
    return NextResponse.json({ success: false, error: "Failed to process callback" }, { status: 500 })
  }
}
