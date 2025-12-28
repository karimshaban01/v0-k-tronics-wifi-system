"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Wifi, Clock, Database } from "lucide-react"
import type { Package } from "@/lib/types"

interface PackageSelectorProps {
  packages: Package[]
  value: number | null
  onChange: (packageId: number) => void
}

function formatDataLimit(mb: number) {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(0)}GB`
  }
  return `${mb}MB`
}

function formatValidity(hours: number) {
  if (hours >= 720) {
    return `${Math.floor(hours / 720)} Month${Math.floor(hours / 720) > 1 ? "s" : ""}`
  }
  if (hours >= 168) {
    return `${Math.floor(hours / 168)} Week${Math.floor(hours / 168) > 1 ? "s" : ""}`
  }
  if (hours >= 24) {
    return `${Math.floor(hours / 24)} Day${Math.floor(hours / 24) > 1 ? "s" : ""}`
  }
  return `${hours} Hour${hours > 1 ? "s" : ""}`
}

export function PackageSelector({ packages, value, onChange }: PackageSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Choose Your Package</Label>
      <RadioGroup
        value={value?.toString() || ""}
        onValueChange={(val) => onChange(Number.parseInt(val))}
        className="gap-3"
      >
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative cursor-pointer transition-all hover:border-primary ${
              value === pkg.id ? "border-2 border-primary bg-accent" : "border"
            }`}
            onClick={() => onChange(pkg.id)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value={pkg.id.toString()} id={`pkg-${pkg.id}`} className="shrink-0 mt-1" />
                  <div>
                    <Label htmlFor={`pkg-${pkg.id}`} className="text-base font-semibold cursor-pointer">
                      {pkg.package_name}
                    </Label>
                    {pkg.description && <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold">
                    {pkg.price.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-muted-foreground">{pkg.currency}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  {formatDataLimit(pkg.data_limit_mb)}
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatValidity(pkg.validity_hours)}
                </Badge>
                {pkg.speed_limit_kbps && (
                  <Badge variant="secondary" className="gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    {(pkg.speed_limit_kbps / 1024).toFixed(0)} Mbps
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </RadioGroup>
    </div>
  )
}
