import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'
import { Link } from 'react-router-dom'

interface Tour {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
}

const PublishedToursList = () => {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTours = async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('id, title, description, start_date, end_date')
        .eq('is_published', true)
        .order('start_date', { ascending: true })

      if (error) {
        console.error('Error fetching tours:', error.message)
      } else {
        setTours(data)
      }

      setLoading(false)
    }

    fetchTours()
  }, [])

  if (loading) return <div className="text-center mt-6 text-gray-600">Loading tours...</div>
  if (tours.length === 0)
    return <div className="text-center mt-6 text-gray-500">No published tours available.</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Upcoming Tours</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {tours.map((tour) => (
          <Link
            to={`/tours/${tour.id}`}
            key={tour.id}
            className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2">
              {tour.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">{tour.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(tour.start_date + 'T00:00:00').toLocaleDateString()} –{' '}
              {new Date(tour.end_date + 'T00:00:00').toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PublishedToursList
