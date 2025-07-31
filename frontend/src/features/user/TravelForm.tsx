import React, { useState } from 'react'

interface TravelFormProps {
  onClose: () => void
  onSuccess?: () => void
}

const TravelForm: React.FC<TravelFormProps> = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [guardianName, setGuardianName] = useState('')
  const [guardianCell, setGuardianCell] = useState('')
  const [age, setAge] = useState(0)
  const [gender, setGender] = useState<'male' | 'female'>('female')
  const [allergies, setAllergies] = useState('')
  const [questions, setQuestions] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!email || !name || !gender) {
      setErrorMsg('Please fill out all required fields.')
      return
    }

    setLoading(true)

    // Log the data to the console. You can replace this with your actual API call.
    console.log('Submitting form with data:', {
      email,
      name,
      gender,
      allergies,
      questions,
    })

    // Simulate an API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error(error)
      setErrorMsg('An error occurred while submitting the form.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 bg-gray-800">
      {errorMsg && <div className="text-red-600">{errorMsg}</div>}
      <p>
        All Travelers Must Complete all Sections of This Form in Order to Travel with Tiffany's
        Tours. Please type in Travelers Email below.
      </p>

      <label className="flex flex-col">
        Email Address *
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 px-2 py-1 border rounded"
          required
        />
      </label>

      <label className="flex flex-col">
        <span>
          <span className="text-red-600">*</span>Name
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 px-2 py-1 border rounded"
          required
        />
      </label>
      <label className="flex flex-col">
        <span>
          <span className="text-red-600">*</span>Age
        </span>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="mt-1 px-2 py-1 border rounded"
          required
        />
      </label>
      <label className="flex flex-col">
        <span>
          <span className="text-red-600">*</span>Parent/Guardian Name
        </span>
        <input
          type="text"
          value={guardianName}
          onChange={(e) => setGuardianName(e.target.value)}
          className="mt-1 px-2 py-1 border rounded"
          required
        />
      </label>

      <label className="flex flex-col">
        <span>
          <span className="text-red-600">*</span>Parent/Guardian Cell Number
        </span>
        <input
          type="text" value={guardianCell}
          onChange={(e) => setGuardianCell(e.target.value)}
          className="mt-1 px-2 py-1 border rounded" 
          required
        />
      </label>

      <label className="flex flex-col">
        Do you have any allergies or special medical needs?
        <textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="mt-1 px-2 py-1 border rounded"
        />
      </label>

      <label className="flex flex-col">
        Do you have any questions for your Tour Guide?
        <textarea
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
          className="mt-1 px-2 py-1 border rounded"
        />
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
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </form>
  )
}

export default TravelForm
