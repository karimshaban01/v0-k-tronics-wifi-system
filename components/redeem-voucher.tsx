"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Ticket, Wifi, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function RedeemVoucher() {
  const [voucherCode, setVoucherCode] = useState("")
  const [isRedeeming, setIsRedeeming] = useState(false)
  const { toast } = useToast()

  const handleRedeem = () => {
    if (!voucherCode.trim()) {
      toast({
        title: "Nambari Inahitajika",
        description: "Tafadhali weka nambari ya vocha",
        variant: "destructive",
      })
      return
    }

    setIsRedeeming(true)
    
    // Check if voucher exists and is purchased
    const purchasedVouchers = JSON.parse(localStorage.getItem("purchasedVouchers") || "[]")
    const voucher = purchasedVouchers.find((v: { code: string }) => 
      v.code.toLowerCase() === voucherCode.trim().toLowerCase()
    )

    setTimeout(() => {
      if (voucher) {
        toast({
          title: "Vocha Imethibitishwa!",
          description: `Mpango: ${voucher.plan} - Muda: ${voucher.duration}`,
        })
      } else {
        toast({
          title: "Vocha Haijapata",
          description: "Nambari ya vocha si sahihi au haijalipiwa",
          variant: "destructive",
        })
      }
      setIsRedeeming(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      {/* Redeem Voucher Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-sky-100">
        <div className="flex items-center gap-2 mb-3">
          <Ticket className="w-4 h-4 text-sky-600" />
          <h3 className="font-semibold text-sm text-foreground">Tumia Vocha</h3>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Weka nambari ya vocha"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            className="h-10 text-sm"
          />
          <Button 
            onClick={handleRedeem}
            disabled={isRedeeming}
            className="h-10 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            {isRedeeming ? "..." : "Tumia"}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Weka nambari ya vocha yako na ubonyeze Tumia
        </p>
      </div>

      {/* Reconnect Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-sky-100">
        <div className="flex items-center gap-2 mb-3">
          <Wifi className="w-4 h-4 text-sky-600" />
          <h3 className="font-semibold text-sm text-foreground">Unganisha Tena</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Weka nambari ya muamala wako wa DPO
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Nambari ya muamala (DPO...)"
            className="h-10 text-sm"
          />
          <Button 
            variant="outline"
            className="h-10 px-4 border-sky-500 text-sky-600 hover:bg-sky-50 bg-transparent"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Manual Login Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-sky-100">
        <div className="flex items-center gap-2 mb-3">
          <Wifi className="w-4 h-4 text-sky-600" />
          <h3 className="font-semibold text-sm text-foreground">Ingia kwa Mkono</h3>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Jina la mtumiaji"
            className="h-10 text-sm flex-1"
          />
          <Input
            type="password"
            placeholder="****"
            className="h-10 text-sm w-20"
          />
          <Button 
            className="h-10 px-4 bg-gradient-to-r from-sky-500 to-blue-600"
          >
            Ingia
          </Button>
        </div>
      </div>
    </div>
  )
}
