"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle, RefreshCw, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface ActiveUser {
  voucher_code: string
  phone_number: string
  pfsense_username: string
  activated_at: Date
  expires_at: Date
  package_name: string
  data_limit_mb: number
  total_bytes_used: number
}

export default function PfSensePage() {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "disconnected">("unknown")

  useEffect(() => {
    testConnection()
    fetchActiveUsers()
  }, [])

  const testConnection = async () => {
    setTesting(true)
    try {
      const response = await fetch("/api/pfsense/test-connection")
      const data = await response.json()

      if (data.success) {
        setConnectionStatus("connected")
        toast.success("pfSense connection successful")
      } else {
        setConnectionStatus("disconnected")
        toast.error(data.error || "Failed to connect to pfSense")
      }
    } catch (error) {
      setConnectionStatus("disconnected")
      toast.error("Connection test failed")
    } finally {
      setTesting(false)
    }
  }

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch("/api/pfsense/active-users")
      const data = await response.json()
      if (data.success) {
        setActiveUsers(data.data)
      }
    } catch (error) {
      toast.error("Failed to load active users")
    } finally {
      setLoading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  const getDataUsagePercentage = (used: number, limit: number) => {
    const limitBytes = limit * 1024 * 1024
    return (used / limitBytes) * 100
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">pfSense Integration</h1>
        <p className="text-muted-foreground">Monitor captive portal and active users</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
            {connectionStatus === "connected" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : connectionStatus === "disconnected" ? (
              <XCircle className="h-4 w-4 text-destructive" />
            ) : (
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {connectionStatus === "connected" ? (
                <Badge variant="default" className="bg-green-600">
                  Connected
                </Badge>
              ) : connectionStatus === "disconnected" ? (
                <Badge variant="destructive">Disconnected</Badge>
              ) : (
                <Badge variant="secondary">Unknown</Badge>
              )}
            </div>
            <Button
              onClick={testConnection}
              disabled={testing}
              size="sm"
              variant="outline"
              className="mt-3 bg-transparent"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.length}</div>
            <p className="text-xs text-muted-foreground">Currently connected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Data Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBytes(activeUsers.reduce((sum, user) => sum + Number(user.total_bytes_used), 0))}
            </div>
            <p className="text-xs text-muted-foreground">All active sessions</p>
          </CardContent>
        </Card>
      </div>

      {connectionStatus === "disconnected" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to connect to pfSense. Please check your API configuration in Settings and ensure pfSense is
            accessible.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Users currently connected to the WiFi network</CardDescription>
            </div>
            <Button onClick={fetchActiveUsers} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : activeUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No active sessions at the moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voucher Code</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Data Used</TableHead>
                    <TableHead>Activated</TableHead>
                    <TableHead>Expires</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeUsers.map((user) => {
                    const usagePercent = getDataUsagePercentage(Number(user.total_bytes_used), user.data_limit_mb)
                    return (
                      <TableRow key={user.voucher_code}>
                        <TableCell className="font-mono text-sm">{user.voucher_code}</TableCell>
                        <TableCell>{user.phone_number || "-"}</TableCell>
                        <TableCell>
                          <div className="font-medium">{user.package_name}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatBytes(Number(user.total_bytes_used))}</div>
                            <div className="text-xs text-muted-foreground">
                              {usagePercent.toFixed(1)}% of{" "}
                              {user.data_limit_mb >= 1024
                                ? `${(user.data_limit_mb / 1024).toFixed(0)}GB`
                                : `${user.data_limit_mb}MB`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(user.activated_at), "MMM d, HH:mm")}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(user.expires_at), "MMM d, HH:mm")}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
