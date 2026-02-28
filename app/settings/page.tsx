"use client"

import React, { useState, useEffect } from "react"
import { useUser } from "@/context/user"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserIcon, CreditCardIcon } from "lucide-react"
import toast from "react-hot-toast"
import ButtonCheckout from "@/components/buttons/ButtonCheckout"
import config from "@/config"

export default function SettingsPage() {
  const { user, profile, profileLoading } = useUser()
  const [name, setName] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (profile?.name) {
      setName(profile.name)
    } else if (user?.user_metadata?.name) {
      setName(user.user_metadata.name)
    }
  }, [profile, user])

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({ name })
        .eq("id", user!.id)
      if (error) throw error
      toast.success("Name updated")
    } catch (err) {
      toast.error("Failed to update name")
    } finally {
      setIsSaving(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="max-w-4xl p-8">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-6" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveName} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Manage your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.has_access ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">You have an active subscription.</p>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const res = await fetch("/api/stripe/create-portal", { method: "POST" })
                      const data = await res.json()
                      if (data.url) window.location.href = data.url
                    }}
                  >
                    Manage Subscription
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">You don&apos;t have an active subscription.</p>
                  {config.stripe.plans[0] && (
                    <ButtonCheckout priceId={config.stripe.plans[0].priceId} />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
