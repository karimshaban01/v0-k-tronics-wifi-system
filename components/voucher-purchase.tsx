"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Copy, CheckCircle2, Phone, Mail, Loader2, CreditCard, Wifi } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

const voucherPlans = [
  {
    id: "1day",
    name: "SIKU 1",
    subtitle: "Pasi ya Siku",
    duration: "Saa 24",
    price: 500,
    color: "from-amber-400 to-orange-500",
    borderColor: "border-amber-400",
    textColor: "text-amber-600",
  },
  {
    id: "2days",
    name: "SIKU 2",
    subtitle: "Bila Kikomo",
    duration: "Siku 2",
    price: 1000,
    color: "from-amber-400 to-orange-500",
    borderColor: "border-amber-400",
    textColor: "text-amber-600",
    popular: true,
  },
  {
    id: "1week",
    name: "WIKI",
    subtitle: "Bila Kikomo",
    duration: "Siku 7",
    price: 3000,
    color: "from-amber-400 to-orange-500",
    borderColor: "border-amber-400",
    textColor: "text-amber-600",
  },
  {
    id: "1month",
    name: "MWEZI",
    subtitle: "Bila Kikomo",
    duration: "Siku 30",
    price: 10000,
    color: "from-amber-400 to-orange-500",
    borderColor: "border-amber-400",
    textColor: "text-amber-600",
  },
]

interface PurchasedVoucher {
  code: string
  plan: string
  duration: string
  price: number
  purchaseDate: string
  status: string
  userName: string
  userEmail: string
  userPhone: string
}

export function VoucherPurchase() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [purchasedVoucher, setPurchasedVoucher] = useState<PurchasedVoucher | null>(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [copied, setCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId)
    setShowCheckout(true)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    const plan = voucherPlans.find((p) => p.id === selectedPlan)!

    // Check if vouchers are available
    const voucherRolls = JSON.parse(localStorage.getItem("voucherRolls") || "[]")
    const purchasedVouchers = JSON.parse(localStorage.getItem("purchasedVouchers") || "[]")

    const allAvailableCodes: string[] = []
    voucherRolls.forEach((roll: { codes: string[] }) => {
      roll.codes.forEach((code: string) => {
        if (!purchasedVouchers.find((pv: PurchasedVoucher) => pv.code === code)) {
          allAvailableCodes.push(code)
        }
      })
    })

    if (allAvailableCodes.length === 0) {
      toast({
        title: "Hakuna Vocha Zinazopatikana",
        description: "Samahani, hakuna vocha zinazopatikana kwa sasa. Tafadhali wasiliana na msimamizi.",
        variant: "destructive",
      })
      setShowCheckout(false)
      setIsProcessing(false)
      return
    }

    // Split name into first and last name
    const nameParts = userName.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || firstName

    // Generate unique reference
    const companyRef = `KTRONICS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Store pending purchase
    const pendingPurchase = {
      plan: plan.name,
      duration: plan.duration,
      price: plan.price,
      userName,
      userEmail,
      userPhone,
      companyRef,
    }
    localStorage.setItem("pendingPurchase", JSON.stringify(pendingPurchase))

    try {
      const baseUrl = window.location.origin

      const response = await fetch("/api/dpo/create-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price,
          customerEmail: userEmail,
          customerFirstName: firstName,
          customerLastName: lastName,
          customerPhone: userPhone.replace(/\D/g, ""),
          companyRef,
          redirectURL: `${baseUrl}/payment/callback`,
          backURL: `${baseUrl}`,
          serviceDescription: `K-TRONICS WiFi - ${plan.name}`,
        }),
      })

      const data = await response.json()

      if (data.success && data.paymentURL) {
        window.location.href = data.paymentURL
      } else {
        toast({
          title: "Tatizo la Malipo",
          description: data.resultExplanation || "Imeshindikana kuanzisha malipo. Tafadhali jaribu tena.",
          variant: "destructive",
        })
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Payment initiation error:", error)
      toast({
        title: "Tatizo la Mtandao",
        description: "Imeshindikana kuwasiliana na seva. Tafadhali jaribu tena.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const handleCopyCode = async () => {
    if (purchasedVoucher) {
      try {
        await navigator.clipboard.writeText(purchasedVoucher.code)
        setCopied(true)
        toast({
          title: "Imenakiliwa!",
          description: "Nambari ya vocha imenakiliwa",
        })
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        toast({
          title: "Kunakili Kumeshindikana",
          description: "Tafadhali nakili nambari wewe mwenyewe",
          variant: "destructive",
        })
      }
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("sw-TZ")
  }

  return (
    <>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center">
          <Wifi className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bold text-foreground">Vifurushi</h2>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {voucherPlans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => handlePurchase(plan.id)}
            className={`relative bg-white rounded-xl p-4 border-2 ${plan.borderColor} shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] text-left`}
          >
            {plan.popular && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Maarufu
              </div>
            )}
            <p className={`text-xs font-bold ${plan.textColor} uppercase tracking-wide`}>{plan.name}</p>
            <p className="text-[10px] text-muted-foreground mb-2">{plan.subtitle}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-muted-foreground">TSH</span>
              <span className={`text-2xl font-bold ${plan.textColor}`}>{formatPrice(plan.price)}</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-[10px]">{plan.duration}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={(open) => !isProcessing && setShowCheckout(open)}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg">Kamilisha Ununuzi</DialogTitle>
            <DialogDescription className="text-sm">Jaza taarifa zako kuendelea na malipo</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Jina Kamili</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jina Kamili"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                disabled={isProcessing}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Barua Pepe</Label>
              <Input
                id="email"
                type="email"
                placeholder="barua@mfano.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                disabled={isProcessing}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">Nambari ya Simu</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0700 000 000"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                required
                disabled={isProcessing}
                className="h-10"
              />
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Mpango:</span>
                <span className="font-bold text-amber-600">{voucherPlans.find((p) => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Jumla:</span>
                <span className="text-xl font-bold text-amber-600">
                  TSH {formatPrice(voucherPlans.find((p) => p.id === selectedPlan)?.price || 0)}
                </span>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl">
              <p className="text-xs text-sky-800 text-center">
                Utaelekezwa kwenye DPO Payment kuchagua njia ya malipo
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] bg-white px-2 py-0.5 rounded font-medium text-green-600">M-Pesa</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded font-medium text-red-600">Airtel</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded font-medium text-blue-600">Tigo</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded font-medium text-orange-500">Halo</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded font-medium text-gray-600">Kadi</span>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Inaandaa Malipo...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Endelea na Malipo
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={!!purchasedVoucher} onOpenChange={() => setPurchasedVoucher(null)}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg text-green-600 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Vocha Imenunuliwa!
            </DialogTitle>
            <DialogDescription className="text-sm">Hifadhi nambari yako ya vocha kuunganisha na WiFi</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-4 rounded-xl border-2 border-sky-200">
              <p className="text-xs text-muted-foreground mb-2 text-center">Nambari Yako ya Vocha:</p>
              <p className="text-xl font-bold text-center font-mono break-all mb-3 text-sky-700">{purchasedVoucher?.code}</p>
              <Button variant="outline" className="w-full h-9 text-sm bg-transparent" onClick={handleCopyCode}>
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    Imenakiliwa!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Nakili Nambari
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-xl space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Mpango:</span>
                <span className="font-medium text-xs">{purchasedVoucher?.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Muda:</span>
                <span className="font-medium text-xs">{purchasedVoucher?.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Kiasi:</span>
                <span className="font-medium text-xs">TSH {formatPrice(purchasedVoucher?.price || 0)}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
              <p className="font-semibold text-xs text-amber-900 mb-2">Unahitaji Msaada?</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-amber-800">
                  <Phone className="w-3 h-3" />
                  <span>0785817222, 0628370174</span>
                </div>
                <div className="flex items-center gap-2 text-amber-800">
                  <Mail className="w-3 h-3" />
                  <span>karimxhaban@gmail.com</span>
                </div>
              </div>
            </div>

            <Button className="w-full h-10 bg-gradient-to-r from-sky-500 to-blue-600" onClick={() => setPurchasedVoucher(null)}>
              Nimeelewa!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
