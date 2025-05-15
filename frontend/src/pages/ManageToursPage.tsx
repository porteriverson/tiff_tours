import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { parseISO, eachDayOfInterval, format } from 'date-fns'
import { AddActivityModal } from '../features/tours/AddActivityModal'

const sections = ['Itinerary', 'Accommodations', 'Transportation', 'Travelers']

const ManageTourPage = () => {
  const { tourId } = useParams()
  const navigate = useNavigate()
  const [tourTitle, setTourTitle] = useState('')
  const [activeTab, setActiveTab] = useState('Itinerary')
  const [tourDates, setTourDates] = useState<{ start_date: string; end_date: string } | null>(null)
  const [daysArray, setDaysArray] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activitiesByDay, setActivitiesByDay] = useState<Record<number, any[]>>({})

  const fetchTour = useCallback(async () => {
    if (!tourId) return

    const { data, error } = await supabase
      .from('tours')
      .select('title, start_date, end_date')
      .eq('id', tourId)
      .single()

    if (error) {
      console.error(error)
      navigate('/admin')
      return
    }

    setTourTitle(data.title)
    setTourDates({ start_date: data.start_date, end_date: data.end_date })

    const days = eachDayOfInterval({
      start: parseISO(data.start_date),
      end: parseISO(data.end_date),
    }).map((d) => format(d, 'yyyy-MM-dd'))
    setDaysArray(days)

    const { data: activities, error: activitiesError } = await supabase
      .from('itinerary_activities')
      .select('*, itinerary_days(day_number)')
      .in('itinerary_days.tour_id', [tourId])

    if (!activitiesError && activities) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const grouped: Record<number, any[]> = {}
      for (const item of activities) {
        const dayNum = item.itinerary_days?.day_number
        if (!dayNum) continue
        if (!grouped[dayNum]) grouped[dayNum] = []
        grouped[dayNum].push(item)
      }
      setActivitiesByDay(grouped)
    }
  }, [tourId, navigate])

  useEffect(() => {
    fetchTour()
  }, [fetchTour])

  const handleAddItineraryDay = (date: string, dayIndex: number) => {
    setSelectedDate(date)
    setSelectedDayNumber(dayIndex + 1)
    setShowModal(true)
  }

  return (
    <div className="p-6 min-w-screen mx-auto m-18">
      <div className="mb-6">
        <button onClick={() => navigate('/admin')} className="text-blue-500 hover:underline">
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold mt-2">Manage Tour: {tourTitle}</h1>
        {tourDates && (
          <p className="text-sm text-gray-500">
            {tourDates.start_date} to {tourDates.end_date} ({daysArray.length} days)
          </p>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {sections.map((label) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`px-4 py-2 rounded font-medium text-sm transition ${
              activeTab === label
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow justify-between items-center">
        {activeTab === 'Itinerary' && (
          <div className="space-y-4">
            {daysArray.map((date, index) => (
              <div key={date} className="border-b pb-2 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold mb-1">
                    Day {index + 1} - {date}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {activitiesByDay[index + 1]?.length ? (
                      activitiesByDay[index + 1].map((activity, idx) => (
                        <div key={idx} className="mb-1">
                          <span className="font-semibold">{activity.location_name}</span> –{' '}
                          {activity.description}
                          {activity.city_name && activity.country && (
                            <div className="text-xs italic text-gray-400">
                              ({activity.city_name}, {activity.country})
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="italic text-gray-400">No activities yet</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleAddItineraryDay(date, index)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add Item
                </button>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'Accommodations' && <p>Accommodations manager coming soon...</p>}
        {activeTab === 'Transportation' && <p>Transportation manager coming soon...</p>}
        {activeTab === 'Travelers' && <p>Traveler/booking tools coming soon...</p>}
      </div>

      {showModal && selectedDate && selectedDayNumber && tourId && (
        <AddActivityModal
          show={showModal}
          onClose={() => setShowModal(false)}
          tourId={tourId}
          date={selectedDate}
          dayNumber={selectedDayNumber}
          onSuccess={() => {
            setShowModal(false)
            fetchTour()
          }}
        />
      )}
    </div>
  )
}

export default ManageTourPage
