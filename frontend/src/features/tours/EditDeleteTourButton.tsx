import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'

export const EditDeleteTourButton = () => {
  const { tourId } = useParams<{ tourId: string }>()
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) return
      const { data, error } = await supabase.from('tours').select('*').eq('id', tourId).single()
      if (error) {
        alert('Error fetching tour: ' + error.message)
      } else {
        setFormData(data)
      }
    }
    fetchTour()
  }, [tourId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase
      .from('tours')
      .update({
        title: formData.title,
        description: formData.description,
        price: +formData.price,
        start_date: formData.start_date,
        end_date: formData.end_date,
        max_participants: +formData.max_participants,
        is_published: formData.is_published,
      })
      .eq('id', tourId)

    setLoading(false)

    if (error) {
      setError('Error updating tour: ' + error.message)
    } else {
      setShowModal(false)
      location.reload()
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tour?')) return
    const { error } = await supabase.from('tours').delete().eq('id', tourId)
    if (error) {
      alert('Error deleting tour: ' + error.message)
    } else {
      navigate('/admin')
    }
  }

  if (!formData) return null

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Edit Tour
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl w-full max-w-2xl shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-4 text-gray-600 dark:text-gray-300 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4">Edit Tour</h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="mb-4">
              <label className="block text-sm mb-1">Title</label>
              <input
                name="title"
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Description</label>
              <textarea
                name="description"
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Price (USD)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Start Date</label>
                <input
                  name="start_date"
                  type="date"
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">End Date</label>
                <input
                  name="end_date"
                  type="date"
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">Max Participants</label>
              <input
                name="max_participants"
                type="number"
                className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                value={formData.max_participants}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                />
                Published
              </label>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
              <div className="space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
