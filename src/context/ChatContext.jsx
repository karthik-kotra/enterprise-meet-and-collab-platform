import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'

const ChatContext = createContext(null)

const SEED_CONTACTS = []

const SEED_MESSAGES = {}

export function ChatProvider({ children }) {
  const { user } = useAuth()
  const [contacts] = useState(SEED_CONTACTS)
  const [messages, setMessages] = useState(SEED_MESSAGES)
  const [activeContactId, setActiveContactId] = useState(null)

  const getMessages = useCallback(
    (contactId) => messages[contactId] || [],
    [messages]
  )

  const sendMessage = useCallback((contactId, text) => {
    const msg = { id: Date.now(), senderId: 'me', text, ts: Date.now() }
    setMessages((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), msg],
    }))

    // Simulate a reply after a short delay
    const contact = SEED_CONTACTS.find((c) => c.id === contactId)
    if (contact?.online) {
      const replies = [
        'Got it, thanks!',
        'On it 👍',
        'Sounds good!',
        'Will do!',
        'Perfect, talk soon.',
        '🙌',
      ]
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [contactId]: [
            ...(prev[contactId] || []),
            {
              id: Date.now() + 1,
              senderId: contactId,
              text: replies[Math.floor(Math.random() * replies.length)],
              ts: Date.now(),
            },
          ],
        }))
      }, 1200 + Math.random() * 800)
    }
  }, [])

  const getLastMessage = useCallback(
    (contactId) => {
      const msgs = messages[contactId] || []
      return msgs[msgs.length - 1] || null
    },
    [messages]
  )

  return (
    <ChatContext.Provider
      value={{ contacts, messages, activeContactId, setActiveContactId, getMessages, sendMessage, getLastMessage, currentUser: user }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)
