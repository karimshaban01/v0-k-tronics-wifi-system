"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      const data = await response.json()
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Settings saved successfully")
      } else {
        toast.error("Failed to save settings")
      }
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Settings</h1>
          <p className="text-muted-foreground">Configure system settings and integrations</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>General company details displayed on the voucher portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={settings.company_name || ""}
                onChange={(e) => updateSetting("company_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_logo_url">Logo URL</Label>
              <Input
                id="company_logo_url"
                value={settings.company_logo_url || ""}
                onChange={(e) => updateSetting("company_logo_url", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="support_phone">Support Phone</Label>
              <Input
                id="support_phone"
                value={settings.support_phone || ""}
                onChange={(e) => updateSetting("support_phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support_email">Support Email</Label>
              <Input
                id="support_email"
                type="email"
                value={settings.support_email || ""}
                onChange={(e) => updateSetting("support_email", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>pfSense Configuration</CardTitle>
          <CardDescription>Configure pfSense API connection for captive portal management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pfsense_api_url">API URL</Label>
            <Input
              id="pfsense_api_url"
              placeholder="https://your-pfsense-ip/api/v1"
              value={settings.pfsense_api_url || ""}
              onChange={(e) => updateSetting("pfsense_api_url", e.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pfsense_api_key">API Key</Label>
              <Input
                id="pfsense_api_key"
                type="password"
                value={settings.pfsense_api_key || ""}
                onChange={(e) => updateSetting("pfsense_api_key", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pfsense_api_secret">API Secret</Label>
              <Input
                id="pfsense_api_secret"
                type="password"
                value={settings.pfsense_api_secret || ""}
                onChange={(e) => updateSetting("pfsense_api_secret", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mobile Money Integration</CardTitle>
          <CardDescription>Configure payment provider API credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">M-Pesa (Vodacom)</Label>
                <p className="text-sm text-muted-foreground">Enable M-Pesa payment integration</p>
              </div>
              <Switch
                checked={settings.mpesa_api_enabled === "true"}
                onCheckedChange={(checked) => updateSetting("mpesa_api_enabled", checked ? "true" : "false")}
              />
            </div>
            {settings.mpesa_api_enabled === "true" && (
              <div className="grid gap-4 md:grid-cols-3 pl-4 border-l-2">
                <div className="space-y-2">
                  <Label htmlFor="mpesa_shortcode">Business Shortcode</Label>
                  <Input
                    id="mpesa_shortcode"
                    value={settings.mpesa_shortcode || ""}
                    onChange={(e) => updateSetting("mpesa_shortcode", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mpesa_consumer_key">Consumer Key</Label>
                  <Input
                    id="mpesa_consumer_key"
                    type="password"
                    value={settings.mpesa_consumer_key || ""}
                    onChange={(e) => updateSetting("mpesa_consumer_key", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mpesa_consumer_secret">Consumer Secret</Label>
                  <Input
                    id="mpesa_consumer_secret"
                    type="password"
                    value={settings.mpesa_consumer_secret || ""}
                    onChange={(e) => updateSetting("mpesa_consumer_secret", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">Airtel Money</Label>
                <p className="text-sm text-muted-foreground">Enable Airtel Money payment integration</p>
              </div>
              <Switch
                checked={settings.airtel_api_enabled === "true"}
                onCheckedChange={(checked) => updateSetting("airtel_api_enabled", checked ? "true" : "false")}
              />
            </div>
            {settings.airtel_api_enabled === "true" && (
              <div className="grid gap-4 md:grid-cols-2 pl-4 border-l-2">
                <div className="space-y-2">
                  <Label htmlFor="airtel_client_id">Client ID</Label>
                  <Input
                    id="airtel_client_id"
                    value={settings.airtel_client_id || ""}
                    onChange={(e) => updateSetting("airtel_client_id", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="airtel_client_secret">Client Secret</Label>
                  <Input
                    id="airtel_client_secret"
                    type="password"
                    value={settings.airtel_client_secret || ""}
                    onChange={(e) => updateSetting("airtel_client_secret", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Tigo Pesa</Label>
              <p className="text-sm text-muted-foreground">Enable Tigo Pesa payment integration</p>
            </div>
            <Switch
              checked={settings.tigo_api_enabled === "true"}
              onCheckedChange={(checked) => updateSetting("tigo_api_enabled", checked ? "true" : "false")}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Halopesa</Label>
              <p className="text-sm text-muted-foreground">Enable Halopesa payment integration</p>
            </div>
            <Switch
              checked={settings.halopesa_api_enabled === "true"}
              onCheckedChange={(checked) => updateSetting("halopesa_api_enabled", checked ? "true" : "false")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voucher Settings</CardTitle>
          <CardDescription>Configure voucher generation and behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Auto Generate Vouchers</Label>
              <p className="text-sm text-muted-foreground">Automatically generate vouchers after successful payment</p>
            </div>
            <Switch
              checked={settings.auto_voucher_generation === "true"}
              onCheckedChange={(checked) => updateSetting("auto_voucher_generation", checked ? "true" : "false")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="voucher_code_prefix">Voucher Code Prefix</Label>
            <Input
              id="voucher_code_prefix"
              value={settings.voucher_code_prefix || ""}
              onChange={(e) => updateSetting("voucher_code_prefix", e.target.value)}
              placeholder="KT"
              maxLength={4}
            />
            <p className="text-sm text-muted-foreground">Prefix for generated voucher codes (2-4 characters)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
