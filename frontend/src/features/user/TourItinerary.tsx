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

const TourItinerary = ({ activities }: { activities: Activity[] }) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  // Group by day_number
  const grouped: Record<number, Activity[]> = activities.reduce(
    (acc, activity) => {
      const day = activity.day_number
      if (!acc[day]) acc[day] = []
      acc[day].push(activity)
      return acc
    },
    {} as Record<number, Activity[]>
  )

  const sortedDays = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Itinerary</h2>

      {sortedDays.map((dayNum) => (
        <div
          key={dayNum}
          className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-white dark:bg-gray-800"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">Day {dayNum}</h3>

          <ul className="space-y-3">
            {grouped[dayNum].map((activity) => (
              <li
                key={activity.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 dark:bg-gray-900 px-4 py-3 rounded-md border border-gray-100 dark:border-gray-700"
              >
                <div>
                  <p className="text-start font-medium text-gray-800 dark:text-white">
                    {activity.location_name} — {activity.city}, {activity.country}
                  </p>
                  <p className="text-start text-sm text-gray-500 dark:text-gray-400">
                    {activity.description}
                  </p>
                </div>
                {activity.start_time && activity.end_time && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0 sm:text-right">
                    {formatTime(activity.start_time)} – {formatTime(activity.end_time)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default TourItinerary
