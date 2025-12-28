"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Ticket, CreditCard, Users, TrendingUp } from "lucide-react"

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const stats = [
    { title: "Total Revenue", value: "TZS 2,450,000", change: "+12.5%", icon: CreditCard, trend: "up" },
    { title: "Active Vouchers", value: "156", change: "+8", icon: Ticket, trend: "up" },
    { title: "Total Sales", value: "1,248", change: "+145", icon: TrendingUp, trend: "up" },
    { title: "Active Users", value: "892", change: "+68", icon: Users, trend: "up" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to K-TRONICS WiFi Management System</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton className="h-8 w-32 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and voucher purchases</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No recent activity to display</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Packages</CardTitle>
            <CardDescription>Most popular packages this month</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Loading package statistics...</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
