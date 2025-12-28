import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if accessing admin routes (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.delete("admin_token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
