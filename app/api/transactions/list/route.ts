import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const transactions = await query("SELECT * FROM transactions ORDER BY created_at DESC LIMIT 500")

    return NextResponse.json({ success: true, data: transactions })
  } catch (error) {
    console.error("[v0] Error fetching transactions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch transactions" }, { status: 500 })
  }
}
