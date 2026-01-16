"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Trash2, Download, Eye, Upload, Copy, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface VoucherRoll {
  id: string
  name: string
  description: string
  uploadDate: string
  voucherCount: number
  codes: string[]
  fileName: string
}

interface PurchasedVoucher {
  code: string
  plan: string
  duration: string
  price: number
  purchaseDate: string
  status: string
  userName: string
  userEmail: string
  userPhone: string
}

export function VoucherList() {
  const [rolls, setRolls] = useState<VoucherRoll[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoll, setSelectedRoll] = useState<VoucherRoll | null>(null)

  useEffect(() => {
    loadRolls()
  }, [])

  const loadRolls = () => {
    const storedRolls = JSON.parse(localStorage.getItem("voucherRolls") || "[]")
    setRolls(storedRolls)
  }

  const handleDelete = (id: string) => {
    const updatedRolls = rolls.filter((roll) => roll.id !== id)
    localStorage.setItem("voucherRolls", JSON.stringify(updatedRolls))
    setRolls(updatedRolls)
  }

  const handleDownload = (roll: VoucherRoll) => {
    const content = roll.codes.join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${roll.name.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sw-TZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredRolls = rolls.filter((roll) => roll.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Mabandiko ya Vocha</CardTitle>
          <CardDescription>Simamia mabandiko yako ya vocha yaliyopakiwa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tafuta mabandiko ya vocha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredRolls.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Hakuna mabandiko ya vocha yaliyopakiwa bado</p>
              <p className="text-sm">Pakia bandiko lako la kwanza la vocha kuanza</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jina la Bandiko</TableHead>
                    <TableHead>Tarehe ya Kupakia</TableHead>
                    <TableHead>Vocha</TableHead>
                    <TableHead>Faili</TableHead>
                    <TableHead className="text-right">Vitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRolls.map((roll) => (
                    <TableRow key={roll.id}>
                      <TableCell className="font-medium">{roll.name}</TableCell>
                      <TableCell>{formatDate(roll.uploadDate)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{roll.voucherCount} nambari</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{roll.fileName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedRoll(roll)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{roll.name}</DialogTitle>
                                <DialogDescription>Imepakiwa tarehe {formatDate(roll.uploadDate)}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {roll.description && (
                                  <div>
                                    <h4 className="text-sm font-semibold mb-1">Maelezo</h4>
                                    <p className="text-sm text-muted-foreground">{roll.description}</p>
                                  </div>
                                )}
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Nambari za Vocha ({roll.voucherCount})</h4>
                                  <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-muted">
                                    <pre className="text-xs font-mono">{roll.codes.join("\n")}</pre>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(roll)}>
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(roll.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchased Vouchers Section - Translated */}
      <Card>
        <CardHeader>
          <CardTitle>Vocha Zilizouzwa</CardTitle>
          <CardDescription>Fuatilia vocha zilizouzwa na taarifa za watumiaji</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchasedVouchers />
        </CardContent>
      </Card>
    </div>
  )
}

function PurchasedVouchers() {
  const [vouchers, setVouchers] = useState<PurchasedVoucher[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const storedVouchers = JSON.parse(localStorage.getItem("purchasedVouchers") || "[]")
    setVouchers(storedVouchers)
  }, [])

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      toast({
        title: "Imenakiliwa!",
        description: "Nambari ya vocha imenakiliwa",
      })
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      toast({
        title: "Kunakili Kumeshindikana",
        description: "Tafadhali nakili nambari wewe mwenyewe",
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("sw-TZ")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sw-TZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredVouchers = vouchers.filter(
    (v) =>
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.userPhone.includes(searchTerm),
  )

  if (vouchers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Hakuna vocha zilizouzwa bado</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tafuta kwa nambari, jina, barua pepe, au simu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nambari ya Vocha</TableHead>
              <TableHead>Mpango</TableHead>
              <TableHead>Jina la Mteja</TableHead>
              <TableHead>Barua Pepe</TableHead>
              <TableHead>Simu</TableHead>
              <TableHead>Tarehe</TableHead>
              <TableHead>Kiasi</TableHead>
              <TableHead>Hali</TableHead>
              <TableHead className="text-right">Vitendo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVouchers.map((voucher, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-sm">{voucher.code}</TableCell>
                <TableCell className="font-medium">{voucher.plan}</TableCell>
                <TableCell>{voucher.userName || "Haijulikani"}</TableCell>
                <TableCell>{voucher.userEmail}</TableCell>
                <TableCell>{voucher.userPhone}</TableCell>
                <TableCell>{formatDate(voucher.purchaseDate)}</TableCell>
                <TableCell className="font-semibold">TSH {formatPrice(voucher.price)}</TableCell>
                <TableCell>
                  <Badge variant={voucher.status === "active" ? "default" : "secondary"}>
                    {voucher.status === "active" ? "Hai" : "Imeisha"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleCopyCode(voucher.code)}>
                    {copiedCode === voucher.code ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
