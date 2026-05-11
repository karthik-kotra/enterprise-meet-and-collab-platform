import { createContext, useContext, useState } from 'react'

const MeetingsContext = createContext(null)

const SAMPLE_MEETINGS = [
  {
    id: '1',
    title: 'Q3 Product Review',
    description: 'Reviewing product milestones and roadmap for Q3. All team leads required.',
    date: '2026-05-15',
    time: '10:00',
    status: 'upcoming',
    participants: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Design Sprint Kickoff',
    description: 'Starting the new design sprint for the mobile app redesign project.',
    date: '2026-05-12',
    time: '14:00',
    status: 'upcoming',
    participants: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Backend Architecture Discussion',
    description: 'Deep dive into the new microservices architecture proposal.',
    date: '2026-05-08',
    time: '11:00',
    status: 'completed',
    participants: 4,
    createdAt: new Date().toISOString(),
  },
]

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
