"use client"

import { LogOutIcon, SettingsIcon } from "lucide-react"
import { useUser } from "@/context/user"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export function UserHeaderDropdown() {
  const { user, profile, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return <Skeleton className="h-9 w-9 rounded-full" />
  }

  const displayName = user?.user_metadata?.name || profile?.name || "User"
  const email = user?.email || ""
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground text-sm font-medium outline-none hover:opacity-90 transition-opacity">
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
