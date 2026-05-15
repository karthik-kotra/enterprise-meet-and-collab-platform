import { createContext, useContext, useState } from 'react'

const MeetingsContext = createContext(null)

const SAMPLE_MEETINGS = []

export function MeetingsProvider({ children }) {
  const [meetings, setMeetings] = useState(SAMPLE_MEETINGS)

  const createMeeting = (data) => {
    const newMeeting = {
      id: Date.now().toString(),
      ...data,
      status: 'upcoming',
      participants: 1,
      createdAt: new Date().toISOString(),
    }
    setMeetings((prev) => [newMeeting, ...prev])
    return newMeeting
  }

  const getMeeting = (id) => meetings.find((m) => m.id === id)

  const deleteMeeting = (id) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <MeetingsContext.Provider value={{ meetings, createMeeting, getMeeting, deleteMeeting }}>
      {children}
    </MeetingsContext.Provider>
  )
}

export const useMeetings = () => useContext(MeetingsContext)
