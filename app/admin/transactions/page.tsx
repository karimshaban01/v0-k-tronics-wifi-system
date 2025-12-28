"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface Transaction {
  id: number
  transaction_reference: string
  phone_number: string
  amount: number
  currency: string
  payment_provider: string
  status: string
  created_at: Date
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions/list")
      const data = await response.json()
      if (data.success) {
        setTransactions(data.data)
      } else {
        toast.error("Failed to load transactions")
      }
    } catch (error) {
      toast.error("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      reversed: "outline",
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Transactions</h1>
        <p className="text-muted-foreground">View all payment transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Monitor Mobile Money payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No transactions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.transaction_reference}</TableCell>
                      <TableCell>{tx.phone_number}</TableCell>
                      <TableCell className="font-semibold">
                        {tx.amount.toLocaleString()} {tx.currency}
                      </TableCell>
                      <TableCell className="capitalize">{tx.payment_provider.replace("_", " ")}</TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(tx.created_at), "MMM d, yyyy HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
