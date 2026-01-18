"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Wifi, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

interface LoginFormProps {
  onBack: () => void
}

export function LoginForm({ onBack }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true")
      router.push("/admin")
    } else {
      setError("Jina la mtumiaji au nywila si sahihi")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-sky-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Rudi Nyumbani
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-sky-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-4">
              <Wifi className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">K-TRONICS</h1>
            <p className="text-sky-100 text-sm mt-1">Paneli ya Msimamizi</p>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="flex items-center gap-2 justify-center mb-6">
              <Shield className="w-4 h-4 text-sky-600" />
              <span className="text-sm text-muted-foreground">Eneo Lililolindwa</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm">Jina la Mtumiaji</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Weka jina la mtumiaji"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Nywila</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Weka nywila"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 font-semibold"
              >
                Ingia
              </Button>
              <p className="text-[10px] text-center text-muted-foreground bg-muted/50 p-2 rounded-lg">
                Taarifa za majaribio: admin / admin123
              </p>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          &copy; 2026 K-TRONICS WiFi
        </p>
      </div>
    </div>
  )
}
