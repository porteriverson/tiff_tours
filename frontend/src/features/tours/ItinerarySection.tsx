import React from 'react'
import { EditDeleteActivityButtons } from './EditDeleteActivityButtons'

interface Activity {
  id: string
  start_time: string
  end_time: string
  date: string
  location_name: string
  description: string
  city: string
  country: string
  day_number: number
}

interface ItinerarySectionProps {
  daysArray: string[]
  activitiesByDay: Record<number, Activity[]>
  handleAddItineraryDay: (date: string, dayIndex: number) => void
  formatTime: (time: string) => string
  fetchTour: () => void
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  daysArray,
  activitiesByDay,
  handleAddItineraryDay,
  formatTime,
  fetchTour,
}) => {
  return (
    <div className="space-y-4">
      {daysArray.map((date, index) => (
        <div key={date} className="border-b pb-2 flex justify-between items-center">
          <div>
            <h3 className="flex font-semibold mb-1 underline">
              Day {index + 1} - {new Date(date + 'T00:00:00').toLocaleDateString()}
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {activitiesByDay[index + 1]?.length ? (
                activitiesByDay[index + 1].map((activity) => (
                  <div key={activity.id} className="flex justify-between items-start mb-2">
                    <div>
                      {activity.city && activity.country && (
                        <div>
                          <div className="text-start flex font-semibold">
                            {activity.location_name}
                          </div>
                          <div className="items-start flex font-semibold text-gray-300 text-md">
                            {activity.city}, {activity.country}
                          </div>
                        </div>
                      )}
                      <div className="items-start flex italic text-gray-400 text-sm">
                        {formatTime(activity.start_time)} – {formatTime(activity.end_time)} –{' '}
                        {activity.description}
                      </div>
                    </div>
                    <div className="flex gap-2 mx-10">
                      <EditDeleteActivityButtons
                        id={activity.id}
                        initialData={{
                          start_time: activity.start_time,
                          end_time: activity.end_time,
                          date: activity.date,
                          day_number: activity.day_number,
                          location_name: activity.location_name,
                          description: activity.description,
                          city: activity.city,
                          country: activity.country,
                        }}
                        onChange={fetchTour}
                      />
                    </div>
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
            Add Activity
          </button>
        </div>
      ))}
    </div>
  )
}
