"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const salesData = [
  { name: "Mon", sales: 12, revenue: 18000 },
  { name: "Tue", sales: 19, revenue: 28500 },
  { name: "Wed", sales: 15, revenue: 22500 },
  { name: "Thu", sales: 22, revenue: 33000 },
  { name: "Fri", sales: 28, revenue: 42000 },
  { name: "Sat", sales: 35, revenue: 52500 },
  { name: "Sun", sales: 30, revenue: 45000 },
]

const packageData = [
  { name: "Daily 1GB", sales: 45 },
  { name: "Daily 2GB", sales: 38 },
  { name: "Weekly 5GB", sales: 28 },
  { name: "Weekly 10GB", sales: 22 },
  { name: "Monthly 30GB", sales: 15 },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Reports & Analytics</h1>
        <p className="text-muted-foreground">View sales trends and performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Revenue", value: "TZS 2,450,000", change: "+12.5%" },
          { label: "Vouchers Sold", value: "1,248", change: "+145" },
          { label: "Avg. Transaction", value: "TZS 1,963", change: "+3.2%" },
          { label: "Active Users", value: "892", change: "+68" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Sales Trend</CardTitle>
          <CardDescription>Sales and revenue for the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--muted-foreground))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Packages</CardTitle>
          <CardDescription>Most popular packages this month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={packageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
