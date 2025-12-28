import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { generateTransactionReference } from "@/lib/voucher-generator"
import type { Package } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const { package_id, phone_number, payment_provider } = await request.json()

    if (!package_id || !phone_number || !payment_provider) {
      return NextResponse.json(
        { success: false, error: "Package ID, phone number, and payment provider are required" },
        { status: 400 },
      )
    }

    // Validate phone number format (Tanzanian)
    const phoneRegex = /^(\+255|0)[67]\d{8}$/
    if (!phoneRegex.test(phone_number)) {
      return NextResponse.json({ success: false, error: "Invalid phone number format" }, { status: 400 })
    }

    // Get package details
    const pkg = await queryOne<Package>("SELECT * FROM packages WHERE id = ? AND is_active = TRUE", [package_id])

    if (!pkg) {
      return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 })
    }

    // Generate transaction reference
    const transactionRef = generateTransactionReference()

    // Create transaction record
    await query(
      `INSERT INTO transactions 
       (transaction_reference, phone_number, amount, currency, payment_provider, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [transactionRef, phone_number, pkg.price, pkg.currency, payment_provider],
    )

    // TODO: Integrate with actual payment provider APIs
    // For now, return the transaction reference for testing

    return NextResponse.json({
      success: true,
      data: {
        transaction_reference: transactionRef,
        amount: pkg.price,
        currency: pkg.currency,
        payment_provider,
        package_name: pkg.package_name,
        phone_number,
      },
    })
  } catch (error) {
    console.error("[v0] Error initiating transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to initiate transaction" }, { status: 500 })
  }
}
