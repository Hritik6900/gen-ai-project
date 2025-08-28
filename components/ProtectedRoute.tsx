"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { AuthModal } from "./auth/AuthModal"
import { Card } from "./ui/card"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true)
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 bg-card border-primary/20">
          <div className="flex items-center space-x-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-foreground">Loading...</span>
          </div>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <Card className="p-8 bg-card border-primary/20 text-center">
              <h2 className="text-2xl font-bold text-primary mb-4">Authentication Required</h2>
              <p className="text-muted-foreground">Please sign in to access this content.</p>
            </Card>
          </div>
        )}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  return <>{children}</>
}
