"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PackageSelector } from "@/components/package-selector"
import { PaymentProviderSelector } from "@/components/payment-provider-selector"
import { Wifi, Smartphone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Package, PaymentProvider } from "@/lib/types"

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingPackages, setLoadingPackages] = useState(true)
  const [voucherCode, setVoucherCode] = useState<string | null>(null)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages")
      const data = await response.json()
      if (data.success) {
        setPackages(data.data)
      } else {
        toast.error("Failed to load packages")
      }
    } catch (error) {
      toast.error("Failed to load packages")
    } finally {
      setLoadingPackages(false)
    }
  }

  const handlePurchase = async () => {
    if (!selectedPackage || !selectedProvider || !phoneNumber) {
      toast.error("Please fill in all fields")
      return
    }

    const phoneRegex = /^(\+255|0)[67]\d{8}$/
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Please enter a valid Tanzanian phone number")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/transactions/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_id: selectedPackage,
          phone_number: phoneNumber,
          payment_provider: selectedProvider,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Payment request sent! Please check your phone to complete the payment.")

        // Simulate payment success for demo purposes
        setTimeout(async () => {
          const callbackResponse = await fetch("/api/transactions/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transaction_reference: data.data.transaction_reference,
              status: "success",
              provider_transaction_id: `${selectedProvider.toUpperCase()}-${Date.now()}`,
            }),
          })

          const callbackData = await callbackResponse.json()

          if (callbackData.success && callbackData.data.voucher_code) {
            setVoucherCode(callbackData.data.voucher_code)
            toast.success("Payment successful! Your voucher code is ready.")
          }
        }, 3000)
      } else {
        toast.error(data.error || "Failed to initiate payment")
      }
    } catch (error) {
      toast.error("Failed to process payment request")
    } finally {
      setLoading(false)
    }
  }

  if (voucherCode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>Your WiFi voucher is ready to use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg text-center">
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">Your Voucher Code</Label>
              <div className="text-2xl font-bold font-mono tracking-wider">{voucherCode}</div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Connect to the WiFi network and enter this code when prompted. The voucher will be activated upon first
                use.
              </AlertDescription>
            </Alert>

            <Button onClick={() => window.location.reload()} className="w-full" variant="outline">
              Buy Another Voucher
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Wifi className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balance">K-TRONICS WIFI</h1>
              <p className="text-sm text-muted-foreground">Fast & Reliable Internet Access</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-balance">Buy Internet Voucher</CardTitle>
              <CardDescription>
                Choose your package and pay instantly with Mobile Money to get your WiFi access code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingPackages ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <PackageSelector packages={packages} value={selectedPackage} onChange={setSelectedPackage} />

                  <Separator />

                  <PaymentProviderSelector value={selectedProvider} onChange={setSelectedProvider} />

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-semibold">
                      Mobile Money Phone Number
                    </Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+255 XXX XXX XXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter the phone number registered with your Mobile Money account
                    </p>
                  </div>

                  <Button
                    onClick={handlePurchase}
                    disabled={loading || !selectedPackage || !selectedProvider || !phoneNumber}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4 mr-2" />
                        Pay with Mobile Money
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By purchasing, you agree to our terms of service. You will receive a USSD prompt on your phone to
                    complete the payment.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Need help? Contact support: +255 XXX XXX XXX</p>
          </div>
        </div>
      </main>
    </div>
  )
}
