import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { queryOne } from "@/lib/db"
import type { AdminUser } from "@/lib/types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(payload: { userId: number; username: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded) return null

    const user = await queryOne<AdminUser>("SELECT * FROM admin_users WHERE id = ? AND is_active = TRUE", [
      decoded.userId,
    ])

    return user
  } catch (error) {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_token")
}
