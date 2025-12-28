"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Admin Users</h1>
        <p className="text-muted-foreground">Manage administrator accounts and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>View and manage administrator accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>User management interface coming soon.</p>
            <p className="text-sm mt-2">Contact system administrator to manage user accounts.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
