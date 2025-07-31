import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabaseClient'
import TravelForm from './TravelForm'

// Define an interface for the data we expect from the booked_travelers table
interface TravelerData {
  travel_forms_complete: boolean
  // Add other fields from your table here if needed, e.g., 'medical_form_complete'
}

const UserChecklist = () => {
  const [travelerData, setTravelerData] = useState<TravelerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTravelForm, setShowTravelForm] = useState(false)

  const fetchTravelerData = async () => {
    setLoading(true)
    setError(null)

    // Get the current user from the Supabase auth session
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('You must be logged in to see this checklist.')
      setLoading(false)
      return
    }

    // Query the 'booked_travelers' table for the current user's data
    const { data, error: dbError } = await supabase
      .from('booked_travelers')
      .select('travel_forms_complete')
      .eq('user_id', user.id)
      .single()

    if (dbError) {
      if (dbError.code === 'PGRST116') {
        // This error code means no rows were returned, i.e., the user is not booked
        setError(`You are not currently booked on a tour.`)
      } else {
        console.error('Error fetching traveler data:', dbError)
        setError('An error occurred while fetching your checklist.')
      }
      setTravelerData(null)
    } else {
      // Map the returned property to match the TravelerData interface
      setTravelerData({
        travel_forms_complete: data.travel_forms_complete,
        // Add other fields here if needed
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTravelerData()
  }, [])

  const handleTravelFormSuccess = () => {
    // When the travel form is submitted successfully, close the form
    setShowTravelForm(false)
    // Re-fetch the data to update the checklist status
    fetchTravelerData()
  }

  if (loading) {
    return <div className="p-4 text-center">Loading checklist...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600 text-center">{error}</div>
  }

  return (
    <div className="p-4 dark:bg-gray-700 rounded-lg shadow-md">
      <ul className="space-y-2 ">
        <li className="flex items-center space-x-2">
          {travelerData?.travel_forms_complete ? (
            <>
              <span className="text-green-500">✓</span>
              <span>Travel form is complete!</span>
            </>
          ) : (
            <>
              {/* <span className="text-gray-500 dark:text-gray-900">☐</span> */}
              <span className="dark:text-gray-200">Fill out Travel Form</span>
              <button
                onClick={() => setShowTravelForm(true)}
                className="ml-auto px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Start Form
              </button>
            </>
          )}
        </li>
        {/* You can add more checklist items here, for example: */}
        {/* <li className="flex items-center space-x-2">
          {travelerData?.medical_form_complete ? (
            <>
              <span className="text-green-500">✓</span>
              <span>Medical form is complete!</span>
            </>
          ) : (
            <>
              <span className="text-gray-500">☐</span>
              <span>Fill out Medical Form</span>
              <button
                // ... logic to open medical form
                className="ml-auto px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Start Form
              </button>
            </>
          )}
        </li> */}
      </ul>

      {showTravelForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-xl w-full">
            <h3 className="text-lg font-bold mb-4">Travel Information Form</h3>
            <TravelForm
              onClose={() => setShowTravelForm(false)}
              onSuccess={handleTravelFormSuccess}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default UserChecklist
