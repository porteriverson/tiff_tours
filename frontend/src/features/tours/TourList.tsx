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
  max_participants: number
}

const TourList = () => {
  const [tours, setTours] = useState<Tour[]>([])
  const [showPastTours, setShowPastTours] = useState(false)
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'

  useEffect(() => {
    const fetchTours = async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return

      const query = supabase
        .from('tours')
        .select('id, title, start_date, end_date, is_published, max_participants')
        .order('start_date', { ascending: true })

      if (showPastTours) {
        query.lt('end_date', today)
      } else {
        query.gte('end_date', today)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error loading tours:', error.message)
      } else {
        setTours(data || [])
      }
    }

    fetchTours()
  }, [showPastTours, today])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Toggle */}
      <div className="flex items-center mb-6">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={showPastTours}
            onChange={() => setShowPastTours((prev) => !prev)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span>Show Past Tours</span>
        </label>
      </div>

      {/* Tour List */}
      {tours.length === 0 ? (
        <p className="text-gray-600">No {showPastTours ? 'past' : 'upcoming'} tours found.</p>
      ) : (
        <ul className="space-y-4">
          {tours.map((tour) => (
            <li key={tour.id} className="p-4 border rounded shadow bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-start">{tour.title}</h2>
                  <p className="text-sm text-gray-500 text-start">
                    {new Date(tour.start_date + 'T00:00:00').toLocaleDateString()} –{' '}
                    {new Date(tour.end_date + 'T00:00:00').toLocaleDateString()}
                  </p>
                  <p className="text-sm dark:text-white text-start">
                    {tour.max_participants} Open Spots
                  </p>
                </div>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => navigate(`/admin/tours/${tour.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Manage Tour
                  </button>
                  <PublishToggle tourId={tour.id} initialPublished={tour.is_published} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TourList
