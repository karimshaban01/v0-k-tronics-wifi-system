"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Plus, Pencil, Trash2, Loader2, Database, Clock, Wifi } from "lucide-react"
import { toast } from "sonner"
import { PackageFormDialog } from "@/components/package-form-dialog"
import type { Package } from "@/lib/types"

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages")
      const data = await response.json()
      if (data.success) {
        setPackages(data.data)
      }
    } catch (error) {
      toast.error("Failed to load packages")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (pkg: Package) => {
    setSelectedPackage(pkg)
    setShowForm(true)
  }

  const handleCreate = () => {
    setSelectedPackage(null)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/packages/${deleteId}`, { method: "DELETE" })
      const data = await response.json()

      if (data.success) {
        toast.success("Package deleted successfully")
        fetchPackages()
      } else {
        toast.error(data.error || "Failed to delete package")
      }
    } catch (error) {
      toast.error("Failed to delete package")
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const formatDataLimit = (mb: number) => {
    return mb >= 1024 ? `${(mb / 1024).toFixed(0)}GB` : `${mb}MB`
  }

  const formatValidity = (hours: number) => {
    if (hours >= 720) return `${Math.floor(hours / 720)} Month`
    if (hours >= 168) return `${Math.floor(hours / 168)} Week`
    if (hours >= 24) return `${Math.floor(hours / 24)} Day`
    return `${hours} Hour`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Packages</h1>
          <p className="text-muted-foreground">Manage WiFi packages and pricing</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Package
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
          <CardDescription>View and manage all WiFi packages</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No packages found. Create your first package to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Data Limit</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{pkg.package_name}</div>
                          {pkg.description && <div className="text-sm text-muted-foreground">{pkg.description}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-muted-foreground" />
                          {formatDataLimit(pkg.data_limit_mb)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {formatValidity(pkg.validity_hours)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {pkg.speed_limit_kbps ? (
                          <div className="flex items-center gap-1.5">
                            <Wifi className="w-4 h-4 text-muted-foreground" />
                            {(pkg.speed_limit_kbps / 1024).toFixed(0)} Mbps
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {pkg.price.toLocaleString()} {pkg.currency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={pkg.is_active ? "default" : "secondary"}>
                          {pkg.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(pkg)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(pkg.id)}>
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

      <PackageFormDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        package_={selectedPackage}
        onSuccess={fetchPackages}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the package. Note: packages with existing
              vouchers cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
