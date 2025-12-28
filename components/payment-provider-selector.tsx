"use client"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Smartphone } from "lucide-react"
import type { PaymentProvider } from "@/lib/types"

const providers: { value: PaymentProvider; label: string; logo: string }[] = [
  { value: "mpesa", label: "M-Pesa (Vodacom)", logo: "/m-pesa-logo.jpg" },
  { value: "airtel_money", label: "Airtel Money", logo: "/airtel-money-logo.jpg" },
  { value: "tigo_pesa", label: "Tigo Pesa", logo: "/tigo-pesa-logo.jpg" },
  { value: "halopesa", label: "Halopesa", logo: "/halopesa-logo.jpg" },
]

interface PaymentProviderSelectorProps {
  value: PaymentProvider | null
  onChange: (provider: PaymentProvider) => void
}

export function PaymentProviderSelector({ value, onChange }: PaymentProviderSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Select Payment Method</Label>
      <RadioGroup value={value || ""} onValueChange={(val) => onChange(val as PaymentProvider)} className="gap-3">
        {providers.map((provider) => (
          <Card
            key={provider.value}
            className={`relative cursor-pointer transition-all hover:border-primary ${
              value === provider.value ? "border-2 border-primary bg-accent" : "border"
            }`}
            onClick={() => onChange(provider.value)}
          >
            <div className="flex items-center gap-3 p-4">
              <RadioGroupItem value={provider.value} id={provider.value} className="shrink-0" />
              <div className="flex items-center gap-3 flex-1">
                <div className="w-20 h-10 bg-muted rounded flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-muted-foreground" />
                </div>
                <Label htmlFor={provider.value} className="text-sm font-medium cursor-pointer flex-1">
                  {provider.label}
                </Label>
              </div>
            </div>
          </Card>
        ))}
      </RadioGroup>
    </div>
  )
}
