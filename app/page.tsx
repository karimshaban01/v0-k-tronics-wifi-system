"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wifi, Clock, Users, Shield, Phone, Mail } from "lucide-react"
import { VoucherPurchase } from "@/components/voucher-purchase"
import { LoginForm } from "@/components/login-form"

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wifi className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">K-TRONICS WiFi</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pata ufikiaji wa WiFi papo hapo na mfumo wetu wa vocha. Chagua mpango wako na uunganishe mara moja.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>0785817222, 0628370174</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>karimxhaban@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Features - Translated to Swahili */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Wifi className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-sm">Intaneti ya Kasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Muunganisho wa WiFi wa kasi kwa vifaa vyako vyote</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle className="text-sm">Muda Unaobadilika</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Chagua mipango ya siku, wiki, au mwezi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle className="text-sm">Vifaa Vingi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Unganisha vifaa vingi na mipango ya premium</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <CardTitle className="text-sm">Muunganisho Salama</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Mtandao uliohifadhiwa kwa usalama wa hali ya juu</p>
            </CardContent>
          </Card>
        </div>

        {/* Voucher Purchase Section */}
        <VoucherPurchase />

        {/* Admin Login Button - Translated */}
        <div className="mt-8 text-center">
          <Button variant="ghost" size="sm" onClick={() => setShowLogin(true)}>
            Ingia kwa Msimamizi
          </Button>
        </div>
      </div>
    </main>
  )
}
