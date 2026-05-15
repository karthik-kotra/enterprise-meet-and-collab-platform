import { useState, useRef, useEffect } from 'react'
import { Search, Send, Circle, MessageSquare, Smile } from 'lucide-react'
import { useChat } from '@/context/ChatContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format, isToday, isYesterday } from 'date-fns'

function formatTime(ts) {
  const d = new Date(ts)
  if (isToday(d)) return format(d, 'h:mm a')
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMM d')
}

function getInitials(name = '') {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function ContactRow({ contact, isActive, lastMessage, onClick }) {
  const preview = lastMessage
    ? lastMessage.senderId === 'me'
      ? `You: ${lastMessage.text}`
      : lastMessage.text
    : 'No messages yet'

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150 group',
        isActive
          ? 'bg-primary/15 border border-primary/25'
          : 'hover:bg-secondary/60 border border-transparent'
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarFallback
            className={cn(
              'text-xs font-display font-semibold',
              isActive ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
            )}
          >
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>
        {contact.online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className={cn('text-sm font-display font-semibold truncate', isActive ? 'text-primary' : 'text-foreground')}>
            {contact.name}
          </p>
          {lastMessage && (
            <span className="text-[10px] text-muted-foreground shrink-0">
              {formatTime(lastMessage.ts)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{preview}</p>
      </div>
    </button>
  )
}

function ChatBubble({ msg, isMe, senderName }) {
  return (
    <div className={cn('flex items-end gap-2 group', isMe ? 'flex-row-reverse' : 'flex-row')}>
      {!isMe && (
        <Avatar className="h-7 w-7 shrink-0 mb-1">
          <AvatarFallback className="text-[10px] bg-secondary text-muted-foreground">
            {getInitials(senderName)}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed relative',
          isMe
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-card border border-border text-foreground rounded-bl-sm'
        )}
      >
        {msg.text}
        <span
          className={cn(
            'text-[10px] block mt-1 opacity-60 leading-none',
            isMe ? 'text-right' : 'text-left'
          )}
        >
          {format(new Date(msg.ts), 'h:mm a')}
        </span>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <MessageSquare size={28} className="text-primary opacity-70" />
      </div>
      <div>
        <p className="font-display font-semibold text-foreground text-lg">Your messages</p>
        <p className="text-muted-foreground text-sm mt-1">
          Select a contact to start chatting, or pick up where you left off.
        </p>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const { contacts, activeContactId, setActiveContactId, getMessages, sendMessage, getLastMessage } = useChat()
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const activeContact = contacts.find((c) => c.id === activeContactId)
  const msgs = activeContactId ? getMessages(activeContactId) : []

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  useEffect(() => {
    if (activeContactId) inputRef.current?.focus()
  }, [activeContactId])

  const handleSend = () => {
    const text = draft.trim()
    if (!text || !activeContactId) return
    sendMessage(activeContactId, text)
    setDraft('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
      {/* Sidebar panel */}
      <aside className="w-80 shrink-0 flex flex-col border-r border-border bg-card/50">
        {/* Header */}
        <div className="px-5 pt-6 pb-4 border-b border-border">
          <h1 className="font-display text-xl font-bold text-foreground">Messages</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {contacts.filter((c) => c.online).length} teammates online
          </p>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search teammates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm bg-secondary border-transparent focus-visible:border-primary/40"
            />
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-8">No contacts found</p>
          ) : (
            filtered.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                isActive={contact.id === activeContactId}
                lastMessage={getLastMessage(contact.id)}
                onClick={() => setActiveContactId(contact.id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeContact ? (
          <EmptyState />
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card/30 shrink-0">
              <div className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs font-display font-semibold bg-primary/15 text-primary">
                    {getInitials(activeContact.name)}
                  </AvatarFallback>
                </Avatar>
                {activeContact.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-background" />
                )}
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-foreground">{activeContact.name}</p>
                <p className="text-xs flex items-center gap-1.5 text-muted-foreground">
                  {activeContact.online ? (
                    <>
                      <Circle size={7} className="fill-emerald-400 text-emerald-400" />
                      Online · {activeContact.role}
                    </>
                  ) : (
                    <>{activeContact.role}</>
                  )}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {msgs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                  <p className="text-muted-foreground text-sm">No messages yet. Say hello! 👋</p>
                </div>
              ) : (
                msgs.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    msg={msg}
                    isMe={msg.senderId === 'me'}
                    senderName={activeContact.name}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="px-6 py-4 border-t border-border bg-card/30 shrink-0">
              <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-2 border border-border focus-within:border-primary/40 transition-colors">
                <input
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${activeContact.name}…`}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150',
                    draft.trim()
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                      : 'bg-transparent text-muted-foreground cursor-not-allowed opacity-40'
                  )}
                >
                  <Send size={15} />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Press <kbd className="px-1 py-0.5 rounded bg-secondary border border-border font-mono">Enter</kbd> to send
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
