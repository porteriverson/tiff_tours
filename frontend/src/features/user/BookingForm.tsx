import React, { useState } from 'react'
import { supabase } from '../../services/supabaseClient'

interface BookingFormProps {
  tourId: string
  userId: string | null
  onClose: () => void
  onSuccess?: () => void
}

const BookingForm: React.FC<BookingFormProps> = ({ tourId, userId, onClose, onSuccess }) => {
  const [studentName, setStudentName] = useState('')
  const [studentGender, setStudentGender] = useState<'male' | 'female'>('female')
  const [studentType, setStudentType] = useState<'student' | 'parent' | 'chaperone'>('student')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!userId) {
      setErrorMsg('You must be logged in to book.')
      return
    }
    if (!studentName) {
      setErrorMsg('Please enter your name.')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('booked_travelers').insert({
      user_id: userId,
      tour_id: tourId,
      traveler_type: studentType,
      student_name: studentName,
      student_gender: studentGender,
    })

    setLoading(false)
    if (error) {
      console.error(error)
      setErrorMsg(error.message)
    } else {
      onSuccess?.()
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {errorMsg && <div className="text-red-600">{errorMsg}</div>}

      <label className="flex flex-col">
        Your Name *
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="mt-1 px-2 py-1 border rounded"
          required
        />
      </label>

      <label className="flex flex-col">
        Gender *
        <select
          value={studentGender}
          onChange={(e) => setStudentGender(e.target.value as 'male' | 'female')}
          className="mt-1 px-2 py-1 border rounded"
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </label>
      <label className="flex flex-col">
        Traveler Type *
        <select
          value={studentType}
          onChange={(e) => setStudentType(e.target.value as 'student' | 'parent' | 'chaperone')}
          className="mt-1 px-2 py-1 border rounded"
        >
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="chaperone">Chaperone</option>
        </select>
      </label>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Booking…' : 'Book Now'}
        </button>
      </div>
    </form>
  )
}

export default BookingForm
