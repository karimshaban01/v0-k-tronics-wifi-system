import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Package } from "@/lib/types"

export async function GET() {
  try {
    const packages = await query<Package>("SELECT * FROM packages WHERE is_active = TRUE ORDER BY price ASC")

    return NextResponse.json({
      success: true,
      data: packages,
    })
  } catch (error) {
    console.error("[v0] Error fetching packages:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch packages" }, { status: 500 })
  }
}
