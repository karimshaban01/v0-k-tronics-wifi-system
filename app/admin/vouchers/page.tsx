"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Search, XCircle, Loader2, TrendingUp, TrendingDown } from "lucide-react"
import { toast } from "sonner"
import { GenerateVouchersDialog } from "@/components/generate-vouchers-dialog"
import { format } from "date-fns"
import type { Package } from "@/lib/types"

interface Voucher {
  id: number
  voucher_code: string
  package_name: string
  price: number
  status: string
  phone_number: string | null
  purchased_at: Date | null
  activated_at: Date | null
  expires_at: Date | null
  created_at: Date
}

interface VoucherStats {
  total: number
  available: number
  sold: number
  activated: number
  expired: number
  revoked: number
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [stats, setStats] = useState<VoucherStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showGenerate, setShowGenerate] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [packageFilter, setPackageFilter] = useState("all")
  const [revokeId, setRevokeId] = useState<number | null>(null)
  const [revoking, setRevoking] = useState(false)

  useEffect(() => {
    Promise.all([fetchVouchers(), fetchPackages(), fetchStats()])
  }, [statusFilter, packageFilter, search])

  const fetchVouchers = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (packageFilter !== "all") params.append("package_id", packageFilter)
      if (search) params.append("search", search)

      const response = await fetch(`/api/vouchers/list?${params}`)
      const data = await response.json()
      if (data.success) {
        setVouchers(data.data)
      }
    } catch (error) {
      toast.error("Failed to load vouchers")
    } finally {
      setLoading(false)
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages")
      const data = await response.json()
      if (data.success) {
        setPackages(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching packages:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/vouchers/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    }
  }

  const handleRevoke = async () => {
    if (!revokeId) return

    setRevoking(true)
    try {
      const response = await fetch("/api/vouchers/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucher_id: revokeId }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success("Voucher revoked successfully")
        fetchVouchers()
        fetchStats()
      } else {
        toast.error(data.error || "Failed to revoke voucher")
      }
    } catch (error) {
      toast.error("Failed to revoke voucher")
    } finally {
      setRevoking(false)
      setRevokeId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      available: "secondary",
      sold: "default",
      activated: "default",
      expired: "destructive",
      revoked: "outline",
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Vouchers</h1>
          <p className="text-muted-foreground">Manage and monitor all voucher codes</p>
        </div>
        <Button onClick={() => setShowGenerate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Generate Vouchers
        </Button>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total", value: stats.total, icon: null },
            { label: "Available", value: stats.available, icon: TrendingUp },
            { label: "Sold", value: stats.sold, icon: TrendingUp },
            { label: "Activated", value: stats.activated, icon: TrendingUp },
            { label: "Expired", value: stats.expired, icon: TrendingDown },
            { label: "Revoked", value: stats.revoked, icon: XCircle },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                {stat.icon && <stat.icon className="h-4 w-4 text-muted-foreground" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Vouchers</CardTitle>
          <CardDescription>Search and filter vouchers by status and package</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by voucher code or phone number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="activated">Activated</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={packageFilter} onValueChange={setPackageFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by package" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id.toString()}>
                    {pkg.package_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : vouchers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No vouchers found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voucher Code</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Purchased</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow key={voucher.id}>
                      <TableCell className="font-mono text-sm">{voucher.voucher_code}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{voucher.package_name}</div>
                          <div className="text-sm text-muted-foreground">{voucher.price.toLocaleString()} TZS</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                      <TableCell>{voucher.phone_number || "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(voucher.created_at), "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {voucher.purchased_at ? format(new Date(voucher.purchased_at), "MMM d, yyyy HH:mm") : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {voucher.status === "activated" && (
                          <Button variant="ghost" size="sm" onClick={() => setRevokeId(voucher.id)}>
                            <XCircle className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <GenerateVouchersDialog
        open={showGenerate}
        onClose={() => setShowGenerate(false)}
        packages={packages}
        onSuccess={() => {
          fetchVouchers()
          fetchStats()
        }}
      />

      <AlertDialog open={revokeId !== null} onOpenChange={() => setRevokeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Voucher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke this voucher? The user will be disconnected and the voucher will become
              invalid.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={revoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {revoking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Revoking...
                </>
              ) : (
                "Revoke Voucher"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
