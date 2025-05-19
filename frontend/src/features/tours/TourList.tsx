import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { PublishToggle } from './PublishToggle'

interface Tour {
  id: string
  title: string
  start_date: string
  end_date: string
  is_published: boolean
}

const AdminDashboard = () => {
  const [tours, setTours] = useState<Tour[]>([])
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'

  useEffect(() => {
    const fetchTours = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      const { data, error } = await supabase
        .from('tours')
        .select('id, title, start_date, end_date, is_published')
        .gte('start_date', today)
        .order('start_date', { ascending: true })

      if (error) {
        console.error('Error loading tours:', error.message)
      } else {
        setTours(data || [])
      }
    }

    fetchTours()
  }, [tours, today])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {tours.length === 0 ? (
        <p className="text-gray-600">No tours yet.</p>
      ) : (
        <ul className="space-y-4">
          {tours.map((tour) => (
            <li key={tour.id} className="p-4 border rounded shadow bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{tour.title}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(tour.start_date + 'T00:00:00').toLocaleDateString()} –{' '}
                    {new Date(tour.end_date + 'T00:00:00').toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {tour.is_published ? 'Published' : 'Draft'}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/admin/tours/${tour.id}`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Manage Tour
                </button>
                <PublishToggle tourId={tour.id} initialPublished={tour.is_published} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AdminDashboard
