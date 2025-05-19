import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { TourOverview } from '../features/user/TourOverview'
import TourItinerary from '../features/user/TourItinerary'
import Hero from '../components/Hero'

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
  id: number
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

  useEffect(() => {
    const fetchTourData = async () => {
      if (!tourId) return

      setLoading(true)

      // 1. Fetch tour
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

      // 2. Fetch flat itinerary activities
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
      {tour.is_published ? (
        <div className="flex flex-col">
          <Hero
            image={tour.hero_image_url}
            title={tour.title}
            subtitle="Find Meaning in Europe's best cities"
            buttonLink={`/signup/${tour.id}`}
            buttonText="Signup"
          />

          <TourOverview
            title={tour.title}
            dates={{ start: tour.start_date, end: tour.end_date }}
            description={tour.description}
          />

          <div className="flex flex-col lg:flex-row gap-6 px-6 py-10">
            <div className="lg:w-2/3">
              <TourItinerary activities={activities} />
            </div>
            <div className="lg:w-1/3">{/* <TourImages images={tour.images || []} /> */}</div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-12 text-xl text-gray-600">
          <h1>This tour is not publicly available.</h1>
        </div>
      )}
    </>
  )
}

export default TourDetailsPage
