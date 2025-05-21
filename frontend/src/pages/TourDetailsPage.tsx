import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { TourOverview } from '../features/user/TourOverview'
import TourItinerary from '../features/user/TourItinerary'
import { AddInterestForm } from '../features/user/AddInterestForm'
import TourImageCarousel from '../features/user/TourImageCarousel'

type Activity = {
  id: number
  tour_id: string
  day_number: number
  start_time: string
  end_time: string
  description: string
  location_name: string
  city: string
  country: string
}

type Tour = {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  hero_image_url: string
  is_published: boolean
  images: string[]
}

const TourDetailsPage = () => {
  const { tourId } = useParams()
  const [tour, setTour] = useState<Tour | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchTourData = async () => {
      if (!tourId) return
      setLoading(true)

      const { data: tourData, error: tourError } = await supabase
        .from('tours')
        .select('*')
        .eq('id', tourId)
        .single()

      if (tourError || !tourData) {
        console.error('Error loading tour', tourError)
        setLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id || null)

      const { data: activitiesData, error: activitiesError } = await supabase
        .from('itinerary_activities')
        .select('*')
        .eq('tour_id', tourId)
        .order('day_number', { ascending: true })
        .order('start_time', { ascending: true })

      if (activitiesError) {
        console.error('Error loading itinerary activities', activitiesError)
        setLoading(false)
        return
      }

      setTour(tourData)
      setActivities(activitiesData || [])
      setLoading(false)
    }

    fetchTourData()
  }, [tourId])

  if (loading || !tour) return <p className="text-center mt-10">Loading tour details...</p>

  return (
    <>
      <div className="min-w-screen min-h-screen">
        {tour.is_published ? (
          <div className="flex flex-col items-center px-6 py-10">
            {/* Top Overview Section */}
            <TourOverview
              title={tour.title}
              dates={{ start: tour.start_date, end: tour.end_date }}
              description={tour.description}
            />

            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              I'm Interested
            </button>

            {/* Modal */}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 rounded shadow-lg p-6 w-full max-w-lg relative">
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:text-gray-300"
                  >
                    &times;
                  </button>
                  <AddInterestForm
                    tourId={tour.id}
                    userId={userId}
                    onSuccess={() => setShowModal(false)}
                  />
                </div>
              </div>
            )}

            {/* Itinerary and Images Section */}
            <div className="flex flex-col lg:flex-row gap-10 w-7/8 mt-10">
              <div className="lg:w-2/3">
                <TourItinerary activities={activities} />
              </div>
              <div className="lg:w-full">
                {/* Future TourImages Component Placeholder */}
                <div className="w-full bg-gray-800 rounded shadow text-center p-4 text-gray-500">
                  <TourImageCarousel tourId={tour.id} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-12 text-xl text-gray-600">
            <h1>This tour is not publicly available.</h1>
          </div>
        )}
      </div>
    </>
  )
}

export default TourDetailsPage
