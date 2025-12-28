"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import type { Package } from "@/lib/types"

interface GenerateVouchersDialogProps {
  open: boolean
  onClose: () => void
  packages: Package[]
  onSuccess: () => void
}

export function GenerateVouchersDialog({ open, onClose, packages, onSuccess }: GenerateVouchersDialogProps) {
  const [loading, setLoading] = useState(false)
  const [packageId, setPackageId] = useState<string>("")
  const [quantity, setQuantity] = useState("1")
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setGeneratedCodes([])

    try {
      const response = await fetch("/api/vouchers/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_id: Number.parseInt(packageId),
          quantity: Number.parseInt(quantity),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedCodes(data.data.map((v: any) => v.voucher_code))
        toast.success(`Successfully generated ${data.data.length} voucher(s)`)
        onSuccess()
      } else {
        toast.error(data.error || "Failed to generate vouchers")
      }
    } catch (error) {
      toast.error("Failed to generate vouchers")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setGeneratedCodes([])
    setPackageId("")
    setQuantity("1")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Vouchers</DialogTitle>
          <DialogDescription>Create new vouchers for a selected package</DialogDescription>
        </DialogHeader>

        {generatedCodes.length > 0 ? (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Successfully generated {generatedCodes.length} voucher code(s)</AlertDescription>
            </Alert>

            <div className="max-h-96 overflow-y-auto border rounded-lg p-4 space-y-2">
              {generatedCodes.map((code) => (
                <div key={code} className="font-mono text-sm p-2 bg-muted rounded">
                  {code}
                </div>
              ))}
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="package">Select Package *</Label>
              <Select value={packageId} onValueChange={setPackageId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a package" />
                </SelectTrigger>
                <SelectContent>
                  {packages
                    .filter((p) => p.is_active)
                    .map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id.toString()}>
                        {pkg.package_name} - {pkg.price.toLocaleString()} {pkg.currency}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (1-100) *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
              />
              <p className="text-sm text-muted-foreground">Maximum 100 vouchers per generation</p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !packageId}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Vouchers"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
