import { useState } from 'react'
import { User, Mail, Lock, Save, CheckCircle2, Camera } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const initials = form.name
    ? form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    updateProfile({ name: form.name, email: form.email })
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-8 max-w-2xl space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account details</p>
      </div>

      {/* Avatar section */}
      <div className="flex items-center gap-5 p-5 bg-card border border-border rounded-xl">
        <div className="relative group cursor-pointer">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-2xl font-display font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={18} className="text-white" />
          </div>
        </div>
        <div>
          <p className="font-display font-semibold text-foreground">{user?.name}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
          <Button variant="outline" size="sm" className="mt-3 text-xs gap-1.5">
            <Camera size={12} /> Change photo
          </Button>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h2 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
          <User size={15} className="text-primary" />
          Personal Information
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  className="pl-9"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" size="sm" className="gap-2" disabled={loading}>
              {saved ? (
                <>
                  <CheckCircle2 size={14} className="text-primary-foreground" />
                  Saved!
                </>
              ) : loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </span>
              ) : (
                <>
                  <Save size={14} /> Save changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h2 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
          <Lock size={15} className="text-primary" />
          Change Password
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-pw">Current password</Label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="current-pw"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-pw">New password</Label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="new-pw"
                  type="password"
                  placeholder="Min. 8 characters"
                  className="pl-9"
                  value={passwords.next}
                  onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pw">Confirm password</Label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm-pw"
                  type="password"
                  placeholder="Re-enter new password"
                  className="pl-9"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Lock size={13} /> Update password
          </Button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-destructive/30 rounded-xl p-6 space-y-3">
        <h2 className="font-display font-semibold text-sm text-destructive">Danger Zone</h2>
        <p className="text-xs text-muted-foreground">
          Permanently delete your account and all associated data. This action is irreversible.
        </p>
        <Button variant="destructive" size="sm" className="gap-2">
          Delete account
        </Button>
      </div>
    </div>
  )
}
