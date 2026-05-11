import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Video, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    login({ email: form.email, name: form.email.split('@')[0] })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel – branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-card border-r border-border p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/5 border border-primary/10" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-primary/5 border border-primary/10" />
        <div className="absolute top-1/3 -right-12 w-48 h-48 rounded-full bg-primary/5 border border-primary/10" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15 border border-primary/30">
            <Video className="text-primary" size={20} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Meet<span className="text-primary">Flow</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground">
              Meetings,<br />
              <span className="text-primary">reimagined.</span>
            </h1>
            <p className="mt-4 text-muted-foreground font-body text-base leading-relaxed max-w-xs">
              Schedule, join, and manage your meetings in one beautiful workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '50K+', label: 'Active users' },
              { value: '1M+', label: 'Meetings hosted' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9★', label: 'App rating' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-secondary/60 rounded-xl p-4 border border-border">
                <p className="font-display font-bold text-2xl text-primary">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">
          © 2026 MeetFlow. All rights reserved.
        </p>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <Video size={20} className="text-primary" />
            <span className="font-display font-bold text-lg">
              Meet<span className="text-primary">Flow</span>
            </span>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-1.5 text-muted-foreground font-body text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                <input type="checkbox" className="rounded border-border accent-primary" />
                Remember me
              </label>
              <span className="text-primary hover:underline cursor-pointer">Forgot password?</span>
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in <ArrowRight size={16} />
                </span>
              )}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our{' '}
            <span className="text-primary cursor-pointer hover:underline">Terms</span> and{' '}
            <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
