import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { SystemSetting } from "@/lib/types"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const settings = await query<SystemSetting>("SELECT * FROM system_settings ORDER BY setting_key")

    // Convert to key-value object
    const settingsObj: Record<string, string> = {}
    settings.forEach((s) => {
      settingsObj[s.setting_key] = s.setting_value
    })

    return NextResponse.json({ success: true, data: settingsObj })
  } catch (error) {
    console.error("[v0] Error fetching settings:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const settings = await request.json()

    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      await query(
        "UPDATE system_settings SET setting_value = ?, updated_by = ?, updated_at = NOW() WHERE setting_key = ?",
        [value, user.id, key],
      )
    }

    // Log audit
    await query("INSERT INTO audit_logs (admin_user_id, action, table_name, new_values) VALUES (?, ?, ?, ?)", [
      user.id,
      "update_settings",
      "system_settings",
      JSON.stringify(settings),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating settings:", error)
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 })
  }
}
