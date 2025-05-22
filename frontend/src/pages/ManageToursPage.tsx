import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { parseISO, eachDayOfInterval, format, parse, isValid } from 'date-fns'
import { AddActivityModal } from '../features/tours/AddActivityModal'
import { ItinerarySection } from '../features/tours/ItinerarySection'
import { PublishToggle } from '../features/tours/PublishToggle'
import { EditDeleteTourButton } from '../features/tours/EditDeleteTourButton'
import { InterestedList } from '../features/admin/InterestedList'
import TourImageManager from '../features/admin/TourImageManager'
import { BookedList } from '../features/admin/BookedList'

const sections = [
  'Itinerary',
  'Booked Travelers',
  'Interest',
  'Images',
  'Accommodations',
  'Transportation',
]

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
  const [isPublished, setIsPublished] = useState<boolean | null>(null)

  const fetchTour = useCallback(async () => {
    if (!tourId) return

    const { data, error } = await supabase.from('tours').select('*').eq('id', tourId).single()

    if (error) {
      console.error(error)
      navigate('/admin')
      return
    }

    setTourTitle(data.title)
    setTourDates({ start_date: data.start_date, end_date: data.end_date })
    setIsPublished(data.is_published)

    const days = eachDayOfInterval({
      start: parseISO(data.start_date),
      end: parseISO(data.end_date),
    }).map((d) => format(d, 'yyyy-MM-dd'))
    setDaysArray(days)

    const { data: activities, error: activitiesError } = await supabase
      .from('itinerary_activities')
      .select('*')
      .in('tour_id', [tourId])
      .order('day_number', { ascending: true })
      .order('start_time', { ascending: true })

    if (!activitiesError && activities) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const grouped: Record<number, any[]> = {}
      for (const item of activities) {
        const dayNum = item.day_number
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

  const formatTime = (time: string) => {
    try {
      const parsed = parse(time, 'HH:mm:ss', new Date())
      if (!isValid(parsed)) throw new Error('Invalid time format')
      return format(parsed, 'h:mm a')
    } catch {
      return ''
    }
  }

  return (
    <div className="py-24 min-w-screen min-h-screen container mx-auto px-18">
      <div className="mb-6">
        <button onClick={() => navigate('/admin')} className="bg-white hover:underline">
          ← Back to Dashboard
        </button>
        <div className="mt-8 m-5 text-center">
          {tourId && isPublished !== null && (
            <PublishToggle
              tourId={tourId}
              initialPublished={isPublished}
              onToggle={(newStatus) => setIsPublished(newStatus)}
            />
          )}
          <EditDeleteTourButton />
        </div>
        <h1 className="text-2xl font-bold mt-2">Manage Tour: {tourTitle}</h1>
        {tourDates && (
          <p className="text-sm text-gray-500">
            {new Date(tourDates.start_date + 'T00:00:00').toLocaleDateString()} –{' '}
            {new Date(tourDates.end_date + 'T00:00:00').toLocaleDateString()} - ({daysArray.length}{' '}
            days)
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
          <ItinerarySection
            daysArray={daysArray}
            activitiesByDay={activitiesByDay}
            handleAddItineraryDay={handleAddItineraryDay}
            formatTime={formatTime}
            fetchTour={fetchTour}
          />
        )}
        {activeTab === 'Accommodations' && <p>Accommodations manager coming soon...</p>}
        {activeTab === 'Transportation' && <p>Transportation manager coming soon...</p>}
        {activeTab === 'Booked Travelers' && tourId && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <BookedList tourId={tourId} />
          </div>
        )}

        {activeTab === 'Interest' && tourId && <InterestedList tourId={tourId} />}
        {activeTab === 'Images' && tourId && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Manage Tour Images</h2>
            <TourImageManager tourId={tourId} />
          </div>
        )}
      </div>

      {showModal && selectedDate && selectedDayNumber && tourId && (
        <AddActivityModal
          show={showModal}
          onClose={() => setShowModal(false)}
          tourId={tourId}
          date={selectedDate}
          day_number={selectedDayNumber}
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
