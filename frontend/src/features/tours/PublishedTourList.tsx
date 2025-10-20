import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mb-4"></div>
          <p className="text-lg text-slate-600">Loading tours...</p>
        </div>
      </div>
    )
  }

  if (tours.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">No Tours Available</h2>
          <p className="text-slate-600">Check back soon for upcoming adventures!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-b from-sky-50 via-white to-amber-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg mb-4">
            Ready to Explore?
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Upcoming Tours</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join us on an unforgettable journey through history and culture
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {tours.map((tour) => (
            <Link
              to={`/tours/${tour.id}`}
              key={tour.id}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Gradient Header Bar */}
              <div className="h-2 bg-gradient-to-r from-sky-500 to-blue-600"></div>

              {/* Card Content */}
              <div className="p-6 sm:p-8">
                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                  {tour.title}
                </h3>

                {/* Description */}
                <p className="text-slate-700 mb-4 line-clamp-3 leading-relaxed">
                  {tour.description}
                </p>

                {/* Date Section */}
                <div className="flex items-center gap-2 text-slate-600 mb-6">
                  <Calendar className="w-5 h-5 text-sky-500" />
                  <p>Approximate Dates:</p>
                  <span className="text-sm font-medium">
                    {new Date(tour.start_date + 'T00:00:00').toLocaleDateString()} –{' '}
                    {new Date(tour.end_date + 'T00:00:00').toLocaleDateString()}
                  </span>
                </div>

                {/* View Details Button */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <span className="text-sky-600 font-semibold group-hover:text-sky-700 transition-colors">
                    View Details
                  </span>
                  <ArrowRight className="w-5 h-5 text-sky-600 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PublishedToursList
