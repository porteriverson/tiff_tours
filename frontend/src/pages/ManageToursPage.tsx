import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import AddCityForm from '../features/tours/AddCityForm'

const sections = ['Cities', 'Itinerary', 'Accommodations', 'Transportation', 'Travelers']

const ManageTourPage = () => {
  const { tourId } = useParams()
  const navigate = useNavigate()
  const [tourTitle, setTourTitle] = useState('')
  const [activeTab, setActiveTab] = useState('Cities')

  useEffect(() => {
    const fetchTour = async () => {
      if (!tourId) return
      const { data, error } = await supabase.from('tours').select('title').eq('id', tourId).single()

      if (error) {
        console.error(error)
        navigate('/admin')
      } else {
        setTourTitle(data.title)
      }
    }

    fetchTour()
  }, [tourId, navigate])

  return (
    <div className="p-6 min-w-screen mx-auto">
      <div className="mb-6">
        <button onClick={() => navigate('/admin')} className="text-blue-500 hover:underline">
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold mt-2">Manage Tour: {tourTitle}</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {sections.map((label) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`px-4 py-2 rounded font-medium text-sm transition ${
              activeTab === label
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        {activeTab === 'Cities' && tourId && <AddCityForm tourId={tourId} />}
        {activeTab === 'Itinerary' && <p>Itinerary manager coming soon...</p>}
        {activeTab === 'Accommodations' && <p>Accommodations manager coming soon...</p>}
        {activeTab === 'Transportation' && <p>Transportation manager coming soon...</p>}
        {activeTab === 'Travelers' && <p>Traveler/booking tools coming soon...</p>}
      </div>
    </div>
  )
}

export default ManageTourPage
