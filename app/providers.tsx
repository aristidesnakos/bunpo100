'use client'

import { ReactNode } from 'react'
import { UserProvider } from '@/context/user'

interface ProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: ProvidersProps) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  )
}
