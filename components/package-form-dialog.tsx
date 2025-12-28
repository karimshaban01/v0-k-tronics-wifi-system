"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Package } from "@/lib/types"

interface PackageFormDialogProps {
  open: boolean
  onClose: () => void
  package_?: Package | null
  onSuccess: () => void
}

export function PackageFormDialog({ open, onClose, package_, onSuccess }: PackageFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    package_name: "",
    description: "",
    data_limit_mb: "",
    speed_limit_kbps: "",
    validity_hours: "",
    price: "",
    currency: "TZS",
    is_active: true,
  })

  useEffect(() => {
    if (package_) {
      setFormData({
        package_name: package_.package_name,
        description: package_.description || "",
        data_limit_mb: package_.data_limit_mb.toString(),
        speed_limit_kbps: package_.speed_limit_kbps?.toString() || "",
        validity_hours: package_.validity_hours.toString(),
        price: package_.price.toString(),
        currency: package_.currency,
        is_active: package_.is_active,
      })
    } else {
      setFormData({
        package_name: "",
        description: "",
        data_limit_mb: "",
        speed_limit_kbps: "",
        validity_hours: "",
        price: "",
        currency: "TZS",
        is_active: true,
      })
    }
  }, [package_])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = package_ ? `/api/packages/${package_.id}` : "/api/packages/create"
      const method = package_ ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          data_limit_mb: Number.parseInt(formData.data_limit_mb),
          speed_limit_kbps: formData.speed_limit_kbps ? Number.parseInt(formData.speed_limit_kbps) : null,
          validity_hours: Number.parseInt(formData.validity_hours),
          price: Number.parseFloat(formData.price),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(package_ ? "Package updated successfully" : "Package created successfully")
        onSuccess()
        onClose()
      } else {
        toast.error(data.error || "Failed to save package")
      }
    } catch (error) {
      toast.error("Failed to save package")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{package_ ? "Edit Package" : "Create New Package"}</DialogTitle>
          <DialogDescription>
            {package_ ? "Update the package details below" : "Fill in the details to create a new package"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="package_name">Package Name *</Label>
              <Input
                id="package_name"
                value={formData.package_name}
                onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                placeholder="e.g., Daily 1GB"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (TZS) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1500.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the package"
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="data_limit_mb">Data Limit (MB) *</Label>
              <Input
                id="data_limit_mb"
                type="number"
                value={formData.data_limit_mb}
                onChange={(e) => setFormData({ ...formData, data_limit_mb: e.target.value })}
                placeholder="1024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validity_hours">Validity (Hours) *</Label>
              <Input
                id="validity_hours"
                type="number"
                value={formData.validity_hours}
                onChange={(e) => setFormData({ ...formData, validity_hours: e.target.value })}
                placeholder="24"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speed_limit_kbps">Speed (Kbps)</Label>
              <Input
                id="speed_limit_kbps"
                type="number"
                value={formData.speed_limit_kbps}
                onChange={(e) => setFormData({ ...formData, speed_limit_kbps: e.target.value })}
                placeholder="4096"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Active Status</Label>
              <p className="text-sm text-muted-foreground">Enable this package for purchase</p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : package_ ? (
                "Update Package"
              ) : (
                "Create Package"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
