import type React from "react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <AdminHeader />
      <div className="flex-1 flex overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
