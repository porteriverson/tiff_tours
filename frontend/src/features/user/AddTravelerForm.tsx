import { useState } from 'react'
import { supabase } from '../../services/supabaseClient'
import { useNavigate } from 'react-router-dom'

interface AddTravelerFormProps {
  tourId: string
  userId: string
  onSuccess?: () => void
}

export const AddTravelerForm: React.FC<AddTravelerFormProps> = ({ tourId, userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase.from('travelers').insert([
      {
        ...formData,
        user_id: userId,
        tour_id: tourId,
      },
    ])

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      if (onSuccess) onSuccess()
      setFormData({ full_name: '', email: '', phone: '' })
      setTimeout(() => navigate('/'), 3000)
    }

    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold">Sign Up for your trip</h2>
      <label className="items-start">Full Name</label>
      <input
        name="full_name"
        type="text"
        placeholder="Traveler's Full Name"
        value={formData.full_name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="email"
        type="email"
        placeholder="Traveler's Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="phone"
        type="tel"
        placeholder="Traveler's Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Submitting...' : 'Add Traveler'}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Traveler added successfully!</p>}
    </form>
  )
}
