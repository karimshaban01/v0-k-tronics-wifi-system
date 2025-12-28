"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  email: string
  full_name: string
  role: string
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      const data = await response.json()

      if (data.success) {
        setUser(data.data)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/admin/login")
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  return { user, loading, logout, refresh: checkAuth }
}
