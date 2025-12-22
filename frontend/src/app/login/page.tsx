"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (token) {
      localStorage.setItem("token", token)
      localStorage.setItem("user_email", email)
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold mb-2 hover:opacity-80 transition">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <span>TaskFlow</span>
          </Link>
          <p className="text-muted-foreground mt-2">Welcome back! Please login to continue.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-6 text-card-foreground">Sign In</h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-input border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">Demo JWT Token</label>
              <div className="relative">
                <Lock className="absolute left-3 top-4 w-5 h-5 text-muted-foreground" />
                <textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-input border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition font-mono text-sm resize-none"
                  placeholder="Paste your demo token here..."
                  rows={4}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
              Continue to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 p-4 bg-secondary/50 border border-border rounded-xl">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              This is a demo authentication interface. In production, this would be handled by Better Auth with secure
              token management.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
