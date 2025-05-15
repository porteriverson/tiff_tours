import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import CreateTourForm from '../features/tours/CreateTourForm'
import { supabase } from '../services/supabaseClient'
import TourList from '../features/tours/TourList'

function AdminDashboard() {
  const navigate = useNavigate()
  const [createdTourId, setCreatedTourId] = useState<string | null>(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleTourCreated = (tourId: string) => {
    console.log('New tour created with ID:', tourId)
    setCreatedTourId(tourId)
  }

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-4">
      <div>
        <h1 className="text-2xl font-bold mb-2 m-24">Admin Dashboard</h1>

        <TourList />

        <CreateTourForm onTourCreated={handleTourCreated} />

        <div>
          <button
            onClick={handleLogout}
            className="m-5 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
