import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { TourOverview } from '../features/user/TourOverview'
import TourItinerary from '../features/user/TourItinerary'
import { AddInterestForm } from '../features/user/AddInterestForm'
import TourImageCarousel from '../features/user/TourImageCarousel'
import BookingForm from '../features/user/BookingForm'

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
  price: number
  is_published: boolean
  images: string[]
}

const TourDetailsPage = () => {
  const { tourId } = useParams()
  const [tour, setTour] = useState<Tour | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
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

  if (loading || !tour) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50flex items-center justify-items pt-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mb-4"></div>
          <p className="text-lg text-slate-600 ">Loading tour details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-b from-sky-50 via-white to-amber-50">
      <div className="pt-16">
        {tour.is_published ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Top Overview Section */}
            <div className="mb-8">
              <TourOverview
                title={tour.title}
                dates={{ start: tour.start_date, end: tour.end_date }}
                description={tour.description}
              />
            </div>

            {/* Interest Button */}
            <div className="flex justify-center mb-12">
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                I'm Interested
              </button>
            </div>

            {/* Interest Modal */}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative animate-in fade-in zoom-in duration-300">
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-200  text-slate-600  hover:bg-slate-300 transition-colors text-xl font-semibold"
                  >
                    ×
                  </button>
                  <AddInterestForm
                    tourId={tour.id}
                    userId={userId}
                    onSuccess={() => setShowModal(false)}
                  />
                </div>
              </div>
            )}

            {/* Main Content: Itinerary and Sidebar */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Itinerary - Takes up 2 columns */}
              <div className="lg:col-span-2 max-h-[50vh] overflow-y-auto pr-2">
                <TourItinerary activities={activities} />
              </div>

              {/* Sidebar - Images and Booking */}
              <div className="lg:col-span-1 space-y-6">
                {/* Image Carousel */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  <TourImageCarousel tourId={tour.id} />
                </div>

                {/* Pricing and Booking Card */}
                {/* <div className="bg-gradient-to-br from-white to-sky-50 rounded-3xl shadow-xl p-6 border border-slate-200 ">
                  <div className="text-center space-y-4">
                    <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                      Early Bird Discount
                    </div>

                    <div className="py-4">
                      <p className="text-slate-600  text-sm font-medium mb-2">
                        Starting at
                      </p>
                      <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 ">
                        ${tour.price}
                      </p>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 ">
                      <p className="text-amber-900 font-semibold">
                        $100 deposit to save your spot!
                      </p>
                    </div>

                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-2xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Book Now
                    </button>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-300">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300  transition-colors text-xl font-semibold"
                  >
                    ×
                  </button>
                  <BookingForm
                    tourId={tour.id}
                    userId={userId}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={() => {
                      // e.g. show a toast or re-fetch bookings
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center bg-white rounded-3xl shadow-xl p-12 max-w-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Tour Not Available</h1>
              <p className="text-lg text-slate-600 ">
                This tour is not publicly available at the moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TourDetailsPage
