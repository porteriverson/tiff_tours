import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

interface AddActivityModalProps {
  show: boolean
  onClose: () => void
  tourId: string
  date: string
  day_number: number
  onSuccess: () => void
  activityId?: string
  initialData?: {
    start_time?: string
    end_time?: string
    date: string
    day_number: number
    description: string
    location_name: string
    city: string
    country: string
  }
}

export const AddActivityModal = ({
  show,
  onClose,
  tourId,
  date,
  day_number,
  onSuccess,
  activityId,
  initialData,
}: AddActivityModalProps) => {
  const [formData, setFormData] = useState({
    start_time: '',
    end_time: '',
    date: '',
    day_number: 1,
    description: '',
    location_name: '',
    city: '',
    country: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (show && initialData) {
      setFormData({
        start_time: initialData.start_time || '',
        end_time: initialData.end_time || '',
        date: initialData.date || '',
        day_number: initialData.day_number || 1,
        description: initialData.description || '',
        location_name: initialData.location_name || '',
        city: initialData.city || '',
        country: initialData.country || '',
      })
    }
  }, [show, initialData])

  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (activityId) {
      // UPDATE logic
      const { error: updateErr } = await supabase
        .from('itinerary_activities')
        .update(formData)
        .eq('id', activityId)

      setLoading(false)

      if (updateErr) {
        setError(updateErr.message)
      } else {
        onSuccess()
        onClose()
      }
      return
    }

    const { error: insertErr } = await supabase.from('itinerary_activities').insert([
      {
        tour_id: tourId,
        day_number: day_number,
        date: date,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        description: formData.description,
        location_name: formData.location_name,
        city: formData.city,
        country: formData.country,
      },
    ])

    setLoading(false)

    if (insertErr) {
      setError(insertErr.message)
    } else {
      onSuccess()
      onClose()
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">
          {activityId ? 'Edit Activity' : `Add Activity – ${date}`}
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Day Number</label>
            <input
              type="number"
              name="day_number"
              value={formData.day_number}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium">Start Time</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Time</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Activity</label>
            <input
              type="text"
              name="location_name"
              value={formData.location_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading
                ? activityId
                  ? 'Updating...'
                  : 'Adding...'
                : activityId
                  ? 'Update Activity'
                  : 'Add Activity'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white-500 hover:text-gray-700 text-lg"
        >
          ×
        </button>
      </div>
    </div>
  )
}
