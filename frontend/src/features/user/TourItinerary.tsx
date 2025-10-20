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
      <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Itinerary</h2>

      <div className="space-y-6">
        {sortedDays.map((dayNum) => (
          <div
            key={dayNum}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Day Header */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4">
              <h3 className="text-2xl font-bold text-white">Day {dayNum}</h3>
            </div>

            {/* Activities List */}
            <div className="p-6">
              <ul className="space-y-4">
                {grouped[dayNum].map((activity, index) => (
                  <li
                    key={activity.id}
                    className="bg-gradient-to-br from-slate-50 to-sky-50 rounded-2xl p-5 border border-slate-200 hover:border-sky-300 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-grow">
                        {/* Location Badge */}
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-grow">
                            <p className="text-lg font-semibold text-slate-900 mb-1">
                              {activity.location_name}
                            </p>
                            <p className="text-sm text-slate-600 font-medium">
                              {activity.city}, {activity.country}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-700 leading-relaxed ml-11">
                          {activity.description}
                        </p>
                      </div>

                      {/* Time Badge */}
                      {activity.start_time && activity.end_time && (
                        <div className="flex-shrink-0 sm:ml-4">
                          <div className="inline-flex items-center bg-white border border-sky-300 rounded-full px-4 py-2 shadow-sm">
                            <svg
                              className="w-4 h-4 text-sky-600 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm font-medium text-slate-700">
                              {formatTime(activity.start_time)} – {formatTime(activity.end_time)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TourItinerary
