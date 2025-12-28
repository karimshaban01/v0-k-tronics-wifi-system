import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getPfsenseConfig } from "@/lib/pfsense"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const config = await getPfsenseConfig()

    if (!config.apiUrl || !config.apiKey) {
      return NextResponse.json({ success: false, error: "pfSense API not configured" }, { status: 400 })
    }

    // Test connection to pfSense
    try {
      const response = await fetch(`${config.apiUrl}/system/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "Connection successful",
        })
      } else {
        return NextResponse.json({
          success: false,
          error: "Failed to connect to pfSense API",
        })
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: "Connection failed. Please check your pfSense configuration.",
      })
    }
  } catch (error) {
    console.error("[v0] pfSense test error:", error)
    return NextResponse.json({ success: false, error: "Failed to test connection" }, { status: 500 })
  }
}
