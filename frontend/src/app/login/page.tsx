'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from "@/lib/auth-client";
import { Loader2, LogIn, UserPlus, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp.email({
          email,
          password,
          name,
          callbackURL: "/dashboard"
        }, {
            onSuccess: () => {
                router.push("/dashboard");
            },
            onError: (ctx) => {
                setError(ctx.error.message || "Failed to sign up");
            }
        });
      } else {
        await signIn.email({
          email,
          password,
          callbackURL: "/dashboard"
        }, {
            onSuccess: () => {
                router.push("/dashboard");
            },
            onError: (ctx) => {
                setError(ctx.error.message || "Failed to sign in");
            }
        });
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-2xl border border-border">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp ? 'Enter your details to get started' : 'Sign in to access your dashboard'}
          </p>
        </div>
        
        {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive p-3 rounded-lg text-sm border border-destructive/20">
               <AlertCircle className="w-4 h-4" />
               <span>{error}</span>
            </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          {isSignUp && (
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="John Doe"
                  required={isSignUp}
                />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/50"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-muted-foreground/50"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
          >
            {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
            ) : (
                isSignUp ? (
                    <>
                        <UserPlus className="w-5 h-5" /> Sign Up
                    </>
                ) : (
                    <>
                        <LogIn className="w-5 h-5" /> Sign In
                    </>
                )
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <button 
                onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
        </div>
      </div>
    </div>
  );
}