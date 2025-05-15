import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabaseClient'

interface AddCityFormProps {
  tourId: string
}

const AddCityForm: React.FC<AddCityFormProps> = ({ tourId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [cityName, setCityName] = useState('')
  const [country, setCountry] = useState('')
  const [dayNumber, setDayNumber] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase
        .from('tour_cities')
        .select('*')
        .eq('tour_id', tourId)
        .order('day_number')

      if (error) console.error(error)
      else setCities(data)
    }

    fetchCities()
  }, [tourId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('tour_cities').insert([
      {
        tour_id: tourId,
        city_name: cityName,
        country,
        day_number: dayNumber,
      },
    ])

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setCityName('')
      setCountry('')
      setDayNumber((prev) => prev + 1)
      const { data } = await supabase
        .from('tour_cities')
        .select('*')
        .eq('tour_id', tourId)
        .order('day_number')
      if (data) setCities(data)
      setIsOpen(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        + Add City
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-4 text-gray-600 dark:text-gray-300 text-xl"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            <h3 className="text-xl font-semibold mb-4">Add City</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">City Name</label>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  required
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Day Number</label>
                <input
                  type="number"
                  value={dayNumber}
                  onChange={(e) => setDayNumber(Number(e.target.value))}
                  required
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add City'}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </div>
        </div>
      )}

      {cities.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-2">Cities Added</h4>
          <ul className="space-y-2">
            {cities.map((city) => (
              <li key={city.id} className="border-b pb-2">
                Day {city.day_number}: {city.city_name}, {city.country}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AddCityForm
