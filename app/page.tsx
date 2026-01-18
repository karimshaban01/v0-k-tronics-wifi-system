"use client"

import { useState } from "react"
import { Wifi, Phone, Mail, Headphones, CheckCircle } from "lucide-react"
import { VoucherPurchase } from "@/components/voucher-purchase"
import { LoginForm } from "@/components/login-form"
import { RedeemVoucher } from "@/components/redeem-voucher"

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Wifi className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">K-TRONICS</h1>
          </div>
          
          <p className="text-center text-sky-100 text-sm mb-4">
            Mitandao ya Simu Inayoungwa Mkono
          </p>

          {/* Payment Method Logos */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
            <div className="bg-white rounded-lg px-2 py-1 shadow-sm">
              <span className="text-xs font-bold text-green-600">M-PESA</span>
            </div>
            <div className="bg-white rounded-lg px-2 py-1 shadow-sm">
              <span className="text-xs font-bold text-red-600">Airtel</span>
            </div>
            <div className="bg-white rounded-lg px-2 py-1 shadow-sm">
              <span className="text-xs font-bold text-blue-600">Tigo</span>
            </div>
            <div className="bg-white rounded-lg px-2 py-1 shadow-sm">
              <span className="text-xs font-bold text-orange-500">Halo</span>
            </div>
            <div className="bg-white rounded-lg px-2 py-1 shadow-sm">
              <span className="text-xs font-bold text-cyan-600">TTCL</span>
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center justify-center gap-2 text-white/90 text-sm mb-4">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Chagua
            </span>
            <span className="text-white/50">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Lipa
            </span>
            <span className="text-white/50">•</span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Unganisha
            </span>
          </div>

          {/* Support Button */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-full py-2 px-4 flex items-center justify-center gap-2">
            <Headphones className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Msaada: 0785817222</span>
          </div>
        </div>

        {/* Packages Section */}
        <VoucherPurchase />

        {/* Redeem Voucher Section */}
        <RedeemVoucher />

        {/* Contact Info Footer */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-sky-100">
          <h3 className="font-semibold text-sm mb-3 text-foreground">Wasiliana Nasi</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-600" />
              <span>0785817222, 0628370174</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-600" />
              <span>karimxhaban@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Admin Login */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowLogin(true)}
            className="text-xs text-muted-foreground hover:text-sky-600 transition-colors"
          >
            Ingia kwa Msimamizi
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>&copy; 2026 K-TRONICS WiFi</p>
          <p className="mt-1">Powered by K-TRONICS Systems</p>
        </div>
      </div>
    </main>
  )
}
