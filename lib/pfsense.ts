import { queryOne } from "@/lib/db"
import type { SystemSetting, Voucher, Package } from "@/lib/types"

export async function getPfsenseConfig() {
  const apiUrl = await queryOne<SystemSetting>("SELECT setting_value FROM system_settings WHERE setting_key = ?", [
    "pfsense_api_url",
  ])
  const apiKey = await queryOne<SystemSetting>("SELECT setting_value FROM system_settings WHERE setting_key = ?", [
    "pfsense_api_key",
  ])
  const apiSecret = await queryOne<SystemSetting>("SELECT setting_value FROM system_settings WHERE setting_key = ?", [
    "pfsense_api_secret",
  ])

  return {
    apiUrl: apiUrl?.setting_value || "",
    apiKey: apiKey?.setting_value || "",
    apiSecret: apiSecret?.setting_value || "",
  }
}

export async function createPfsenseUser(voucher: Voucher, packageData: Package) {
  const config = await getPfsenseConfig()

  if (!config.apiUrl || !config.apiKey) {
    throw new Error("pfSense API not configured")
  }

  const username = `user_${voucher.voucher_code.replace(/-/g, "").toLowerCase()}`
  const password = voucher.voucher_code

  // Calculate expiration time
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + packageData.validity_hours)

  try {
    // This is a placeholder for actual pfSense API integration
    const response = await fetch(`${config.apiUrl}/captiveportal/voucher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        username,
        password,
        expiration: expiresAt.toISOString(),
        download_limit: packageData.data_limit_mb * 1024 * 1024, // Convert to bytes
        upload_limit: packageData.data_limit_mb * 1024 * 1024,
        bandwidth_down: packageData.speed_limit_kbps || 0,
        bandwidth_up: packageData.speed_limit_kbps || 0,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create pfSense user")
    }

    return { username, success: true }
  } catch (error) {
    console.error("[v0] pfSense API error:", error)
    throw error
  }
}
