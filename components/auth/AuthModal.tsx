"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "login" | "signup"
}

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode)

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login")
  }

 return (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md p-0 bg-transparent border-none">
      {/* ✅ Add this hidden title to fix the warning */}
      <DialogTitle className="sr-only">Authentication</DialogTitle>

      {mode === "login" ? (
        <LoginForm onToggleMode={toggleMode} onClose={onClose} />
      ) : (
        <SignupForm onToggleMode={toggleMode} onClose={onClose} />
      )}
    </DialogContent>
  </Dialog>
)
}
