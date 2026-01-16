"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function VoucherUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [rollName, setRollName] = useState("")
  const [description, setDescription] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !rollName) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const codes = text
        .split("\n")
        .slice(7)
        .map((line) => line.trim().replace(/"/g, ""))
        .filter((line) => line.length > 0)

      const rolls = JSON.parse(localStorage.getItem("voucherRolls") || "[]")
      rolls.push({
        id: Date.now().toString(),
        name: rollName,
        description,
        uploadDate: new Date().toISOString(),
        voucherCount: codes.length,
        codes,
        fileName: file.name,
      })
      localStorage.setItem("voucherRolls", JSON.stringify(rolls))

      setUploadSuccess(true)
      setFile(null)
      setRollName("")
      setDescription("")

      setTimeout(() => setUploadSuccess(false), 3000)
    }
    reader.readAsText(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pakia Bandiko la Vocha</CardTitle>
        <CardDescription>
          Pakia faili ya CSV au maandishi yenye nambari za vocha (vocha ya kwanza inaanza mstari wa 8)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rollName">Jina la Bandiko</Label>
            <Input
              id="rollName"
              placeholder="mfano, Vocha za Kila Siku - Januari 2024"
              value={rollName}
              onChange={(e) => setRollName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Maelezo (Hiari)</Label>
            <Textarea
              id="description"
              placeholder="Ongeza maelezo kuhusu bandiko hili la vocha..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Faili ya Vocha</Label>
            <div className="flex items-center gap-2">
              <Input id="file" type="file" accept=".txt,.csv" onChange={handleFileChange} required className="flex-1" />
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Pakia faili ya maandishi au CSV yenye nambari za vocha (vocha ya kwanza inaanza mstari wa 8)
            </p>
          </div>

          {uploadSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">Bandiko la vocha limepakiwa kwa mafanikio!</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={!file || !rollName}>
            <Upload className="w-4 h-4 mr-2" />
            Pakia Bandiko la Vocha
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Mfano wa Muundo wa Faili:</h4>
          <pre className="text-xs font-mono bg-background p-2 rounded border">
            {`... mistari ya kichwa 1-7 (itarukwa) ...
KT-ABC123-XYZ
KT-DEF456-UVW
KT-GHI789-RST`}
          </pre>
          <p className="text-xs text-muted-foreground mt-2">
            Kumbuka: Mistari 7 ya kwanza inarukwa. Nambari za vocha zinaanza mstari wa 8.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
