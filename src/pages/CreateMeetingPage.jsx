import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Clock, FileText, Type, CheckCircle2 } from 'lucide-react'
import { useMeetings } from '@/context/MeetingsContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CreateMeetingPage() {
  const { createMeeting } = useMeetings()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Meeting title is required.'
    if (!form.date) e.date = 'Please select a date.'
    if (!form.time) e.time = 'Please select a time.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    const meeting = createMeeting(form)
    setLoading(false)
    setSuccess(true)
    await new Promise((r) => setTimeout(r, 1200))
    navigate(`/meeting/${meeting.id}`)
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const today = new Date().toISOString().split('T')[0]

  if (success) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 border border-primary/30 mb-4">
          <CheckCircle2 size={36} className="text-primary" />
        </div>
        <h2 className="font-display font-bold text-2xl text-foreground">Meeting created!</h2>
        <p className="text-muted-foreground mt-1.5">Redirecting to meeting room…</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Create Meeting</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fill in the details below to schedule a new meeting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 text-sm">
            <FileText size={15} className="text-primary" />
            Meeting Details
          </h2>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <div className="relative">
              <Type size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="title"
                placeholder="e.g. Q3 Product Review"
                className="pl-9"
                value={form.title}
                onChange={set('title')}
              />
            </div>
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description{' '}
              <span className="normal-case text-muted-foreground/60 font-normal tracking-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              id="description"
              placeholder="What will this meeting cover? Add agenda items, goals, or context…"
              className="min-h-[120px]"
              value={form.description}
              onChange={set('description')}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-display font-semibold text-foreground flex items-center gap-2 text-sm">
            <CalendarDays size={15} className="text-primary" />
            Schedule
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <CalendarDays size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="date"
                  type="date"
                  min={today}
                  className="pl-9"
                  value={form.date}
                  onChange={set('date')}
                />
              </div>
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="relative">
                <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="time"
                  type="time"
                  className="pl-9"
                  value={form.time}
                  onChange={set('time')}
                />
              </div>
              {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
            </div>
          </div>
        </div>

        {/* Preview card */}
        {(form.title || form.date) && (
          <div className="bg-primary/5 border border-primary/25 rounded-xl p-4 space-y-1.5">
            <p className="text-xs font-display font-semibold text-primary uppercase tracking-wide">Preview</p>
            <p className="font-display font-semibold text-foreground">{form.title || 'Untitled Meeting'}</p>
            {form.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">{form.description}</p>
            )}
            <div className="flex gap-3 text-xs text-muted-foreground pt-1">
              {form.date && (
                <span className="flex items-center gap-1"><CalendarDays size={11} />{form.date}</span>
              )}
              {form.time && (
                <span className="flex items-center gap-1"><Clock size={11} />{form.time}</span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none sm:px-8"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1 sm:flex-none sm:px-8" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Scheduling…
              </span>
            ) : (
              'Schedule Meeting'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
