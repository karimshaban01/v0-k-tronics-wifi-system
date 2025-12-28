import { NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth"
import type { AdminUser } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 })
    }

    const user = await queryOne<AdminUser>("SELECT * FROM admin_users WHERE username = ? AND is_active = TRUE", [
      username,
    ])

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    await query("UPDATE admin_users SET last_login = NOW() WHERE id = ?", [user.id])

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    })

    // Set cookie
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}
