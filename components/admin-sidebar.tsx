"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Ticket, CreditCard, Users, Settings, BarChart3, Server } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Packages", href: "/admin/packages", icon: Package },
  { name: "Vouchers", href: "/admin/vouchers", icon: Ticket },
  { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "pfSense", href: "/admin/pfsense", icon: Server },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card">
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
