"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Wifi, CreditCard, Copy, CheckCircle2, Phone, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const voucherPlans = [
  {
    id: "1day",
    name: "Pasi ya Siku 1",
    duration: "Saa 24",
    price: 500,
    devices: 1,
    speed: "5 Mbps",
    features: ["Kasi ya kawaida", "Kifaa 1", "Msaada wa barua pepe"],
  },
  {
    id: "2days",
    name: "Pasi ya Siku 2",
    duration: "Siku 2",
    price: 1000,
    devices: 2,
    speed: "10 Mbps",
    features: ["Kasi nzuri", "Vifaa 2", "Msaada wa kipaumbele"],
    popular: true,
  },
  {
    id: "1week",
    name: "Pasi ya Wiki",
    duration: "Siku 7",
    price: 3000,
    devices: 5,
    speed: "20 Mbps",
    features: ["Kasi ya juu", "Vifaa 5", "Msaada wa kipaumbele", "Data isiyo na kikomo"],
  },
  {
    id: "1month",
    name: "Pasi ya Mwezi",
    duration: "Siku 30",
    price: 10000,
    devices: 10,
    speed: "50 Mbps",
    features: ["Kasi ya juu kabisa", "Vifaa 10", "Msaada 24/7", "Data isiyo na kikomo"],
  },
]

const paymentMethods = [
  { id: "mpesa", name: "M-Pesa", icon: "📱" },
  { id: "airtel", name: "Airtel Money", icon: "📱" },
  { id: "tigo", name: "Tigo Pesa", icon: "📱" },
  { id: "halopesa", name: "HaloPesa", icon: "📱" },
  { id: "ttcl", name: "TTCL", icon: "📱" },
  { id: "card", name: "Kadi ya Benki", icon: "💳" },
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
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [paymentNumber, setPaymentNumber] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId)
    setShowCheckout(true)
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()

    const voucherRolls = JSON.parse(localStorage.getItem("voucherRolls") || "[]")
    const purchasedVouchers = JSON.parse(localStorage.getItem("purchasedVouchers") || "[]")

    const allAvailableCodes: string[] = []
    voucherRolls.forEach((roll: any) => {
      roll.codes.forEach((code: string) => {
        if (!purchasedVouchers.find((pv: any) => pv.code === code)) {
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
      return
    }

    const voucherCode = allAvailableCodes[0]
    const plan = voucherPlans.find((p) => p.id === selectedPlan)!

    const newPurchase: PurchasedVoucher = {
      code: voucherCode,
      plan: plan.name,
      duration: plan.duration,
      price: plan.price,
      purchaseDate: new Date().toISOString(),
      status: "active",
      userName: userName,
      userEmail: userEmail,
      userPhone: userPhone,
    }

    purchasedVouchers.push(newPurchase)
    localStorage.setItem("purchasedVouchers", JSON.stringify(purchasedVouchers))

    setPurchasedVoucher(newPurchase)
    setShowCheckout(false)
    setUserName("")
    setUserEmail("")
    setUserPhone("")
    setPaymentNumber("")
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2">Chagua Mpango Wako</h2>
        <p className="text-center text-muted-foreground">Chagua vocha ya WiFi inayofaa mahitaji yako</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {voucherPlans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? "border-blue-600 border-2 shadow-lg" : ""}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">Maarufu Zaidi</Badge>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.duration}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">TSH {formatPrice(plan.price)}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Wifi className="w-4 h-4 text-blue-600" />
                  <span>Kasi: {plan.speed}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{plan.devices > 1 ? `Vifaa ${plan.devices}` : `Kifaa ${plan.devices}`}</span>
                </div>
              </div>
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handlePurchase(plan.id)}>
                Nunua Vocha
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kamilisha Ununuzi Wako</DialogTitle>
            <DialogDescription>Jaza taarifa zako na uchague njia ya malipo</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Jina Kamili</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jina Kamili"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Barua Pepe</Label>
              <Input
                id="email"
                type="email"
                placeholder="barua@mfano.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nambari ya Simu</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0700 000 000"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Chagua Njia ya Malipo</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="relative">
                      <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                      <Label
                        htmlFor={method.id}
                        className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-accent peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 transition-all"
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium text-sm">{method.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-number">
                {paymentMethod === "card"
                  ? "Nambari ya Kadi"
                  : `Nambari ya ${paymentMethods.find((m) => m.id === paymentMethod)?.name}`}
              </Label>
              <Input
                id="payment-number"
                type={paymentMethod === "card" ? "text" : "tel"}
                placeholder={paymentMethod === "card" ? "1234 5678 9012 3456" : "0700000000"}
                value={paymentNumber}
                onChange={(e) => setPaymentNumber(e.target.value)}
                required
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Mpango Uliochaguliwa:</span>
                <span className="font-semibold">{voucherPlans.find((p) => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Jumla ya Malipo:</span>
                <span className="text-xl font-bold">
                  TSH {formatPrice(voucherPlans.find((p) => p.id === selectedPlan)?.price || 0)}
                </span>
              </div>
            </div>
            <Button type="submit" className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Kamilisha Malipo
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!purchasedVoucher} onOpenChange={() => setPurchasedVoucher(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Vocha Imenunuliwa Kwa Mafanikio!</DialogTitle>
            <DialogDescription>Hifadhi nambari yako ya vocha kuunganisha na WiFi</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-muted-foreground mb-2">Nambari Yako ya Vocha:</p>
              <p className="text-2xl font-bold text-center font-mono break-all mb-4">{purchasedVoucher?.code}</p>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleCopyCode}>
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
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mpango:</span>
                <span className="font-medium">{purchasedVoucher?.plan}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Muda:</span>
                <span className="font-medium">{purchasedVoucher?.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kiasi Kilicholipwa:</span>
                <span className="font-medium">TSH {formatPrice(purchasedVoucher?.price || 0)}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. Unganisha na mtandao wa K-TRONICS WiFi</p>
              <p>2. Fungua kivinjari chako na uweke nambari ya vocha</p>
              <p>3. Furahia matumizi yako ya intaneti!</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
              <p className="font-semibold text-sm text-blue-900">Unahitaji Msaada? Wasiliana Nasi:</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-blue-800">
                  <Phone className="w-4 h-4" />
                  <span>0785817222, 0628370174</span>
                </div>
                <div className="flex items-center gap-2 text-blue-800">
                  <Mail className="w-4 h-4" />
                  <span>karimxhaban@gmail.com</span>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={() => setPurchasedVoucher(null)}>
              Nimeelewa!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
