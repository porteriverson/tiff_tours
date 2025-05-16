import { useState } from 'react'
import { supabase } from '../../services/supabaseClient'

interface TourFormValues {
  title: string
  description: string
  price: string
  start_date: string
  end_date: string
  max_participants: number
}

const CreateTourModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formValues, setFormValues] = useState<TourFormValues>({
    title: '',
    description: '',
    price: '',
    start_date: '',
    end_date: '',
    max_participants: 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'max_participants' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const user = (await supabase.auth.getUser()).data.user
    if (!user) {
      setError('User not authenticated')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      setError('User profile not found. You must create a profile before adding a tour.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('tours')
      .insert([
        {
          ...formValues,
          price: parseFloat(formValues.price),
          is_published: false,
          created_by_user_id: profile.id,
        },
      ])
      .select('id')
      .single()

    setLoading(false)

    if (error) {
      setError(error.message)
    } else if (data?.id) {
      setIsOpen(false)
      setFormValues({
        title: '',
        description: '',
        price: '',
        start_date: '',
        end_date: '',
        max_participants: 0,
      })
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        + Create New Tour
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl w-full max-w-2xl shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-4 text-gray-600 dark:text-gray-300 text-xl"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4">Create a New Tour</h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm mb-1">Title</label>
                <input
                  name="title"
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                  value={formValues.title}
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
                  value={formValues.description}
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
                  value={formValues.price}
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
                    value={formValues.start_date}
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
                    value={formValues.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-1">Max Participants</label>
                <input
                  name="max_participants"
                  type="number"
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                  value={formValues.max_participants}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Tour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default CreateTourModal
