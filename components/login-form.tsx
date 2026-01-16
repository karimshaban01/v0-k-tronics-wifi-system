"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Wifi } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Rudi Nyumbani
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Wifi className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Ingia kwa Msimamizi</CardTitle>
            <CardDescription>Fikia dashibodi ya usimamizi wa vocha</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Jina la Mtumiaji</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Weka jina la mtumiaji"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Nywila</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Weka nywila"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Ingia
              </Button>
              <p className="text-xs text-center text-muted-foreground">Taarifa za kuingia: admin / admin123</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
