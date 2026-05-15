import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
