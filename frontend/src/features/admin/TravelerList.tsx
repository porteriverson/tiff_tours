import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

interface Traveler {
  id: string
  full_name: string
  email: string
  phone: string
  medical_form_complete: boolean
  travel_form_complete: boolean
}

type FilterType = 'all' | 'missing_medical' | 'missing_travel' | 'missing_both'

export const TravelerList = ({ tourId }: { tourId: string }) => {
  const [travelers, setTravelers] = useState<Traveler[]>([])
  const [filtered, setFiltered] = useState<Traveler[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailSubject, setEmailSubject] = useState('Action Required: Medical Form Reminder')
  const [emailBody, setEmailBody] = useState(
    `Hi,

This is a quick reminder to please complete your form for the upcoming tour.

Let us know if you have any questions!

Best,
Tiffany`
  )

  const openEmailClient = (recipients: Traveler[], subject: string, body: string) => {
    const emails = recipients.map((t) => t.email).join(',')
    const mailtoLink = `mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  const handleOpenEmailClient = () => {
    openEmailClient(
      filtered,
      'Action Required: Medical Form Reminder',
      `Hi,

This is a quick reminder to log in and complete your forms for the upcoming tour.

Let me know if you have any questions!

Best,
Tiffany`
    )
  }

  useEffect(() => {
    const fetchTravelers = async () => {
      const { data, error } = await supabase
        .from('travelers')
        .select('id, full_name, email, phone, medical_form_complete, travel_form_complete')
        .eq('tour_id', tourId)

      if (error) {
        setError(error.message)
      } else {
        setTravelers(data)
        setFiltered(data)
      }

      setLoading(false)
    }

    fetchTravelers()
  }, [tourId])

  useEffect(() => {
    const lowerSearch = search.toLowerCase()
    let result = [...travelers]

    if (filter === 'missing_medical') {
      result = result.filter((t) => !t.medical_form_complete)
    } else if (filter === 'missing_travel') {
      result = result.filter((t) => !t.travel_form_complete)
    } else if (filter === 'missing_both') {
      result = result.filter((t) => !t.travel_form_complete && !t.medical_form_complete)
    }

    if (search) {
      result = result.filter((t) => t.full_name.toLowerCase().includes(lowerSearch))
    }

    setFiltered(result)
  }, [search, filter, travelers])

  if (loading) return <p>Loading travelers...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>
  if (travelers.length === 0) return <p>No travelers signed up yet.</p>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-start">Traveler Signups</h2>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('missing_medical')}
              className={`px-3 py-1 rounded ${
                filter === 'missing_medical' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Missing Medical
            </button>
            <button
              onClick={() => setFilter('missing_travel')}
              className={`px-3 py-1 rounded ${
                filter === 'missing_travel' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Missing Travel
            </button>
            <button
              onClick={() => setFilter('missing_both')}
              className={`px-3 py-1 rounded ${
                filter === 'missing_both' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Missing Both
            </button>
          </div>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300 text-sm"
        />
        {selected.size > 0 && (
          <button
            onClick={() => setShowEmailModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
          >
            Email {selected.size} Traveler{selected.size > 1 ? 's' : ''}
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              <th className="px-2 py-2 border text-center">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelected(new Set(filtered.map((t) => t.id)))
                    } else {
                      setSelected(new Set())
                    }
                  }}
                  checked={selected.size === filtered.length && filtered.length > 0}
                />
              </th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Medical Form</th>
              <th className="px-4 py-2 border">Travel Form</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((traveler) => (
              <tr key={traveler.id} className="border-t text-start">
                <td className="px-2 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selected.has(traveler.id)}
                    onChange={(e) => {
                      const newSet = new Set(selected)
                      if (e.target.checked) {
                        newSet.add(traveler.id)
                      } else {
                        newSet.delete(traveler.id)
                      }
                      setSelected(newSet)
                    }}
                  />
                </td>
                <td className="px-4 py-2 border">{traveler.full_name}</td>
                <td className="px-4 py-2 border">{traveler.email}</td>
                <td className="px-4 py-2 border">{traveler.phone}</td>
                <td className="px-4 py-2 border text-center">
                  {traveler.medical_form_complete ? '✅' : '❌'}
                </td>
                <td className="px-4 py-2 border text-center">
                  {traveler.travel_form_complete ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <button
            onClick={handleOpenEmailClient}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
          >
            Open Email to {filtered.length} Traveler{filtered.length > 1 ? 's' : ''}
          </button>
        )}
      </div>
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded shadow-lg max-w-md w-full space-y-4 min-w-[50%]">
            <h3 className="text-lg font-bold">Edit Email</h3>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full border p-2 rounded text-sm"
              placeholder="Subject"
            />
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="w-full border p-2 rounded text-sm h-32"
              placeholder="Message"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const recipients = travelers.filter((t) => selected.has(t.id))
                  openEmailClient(recipients, emailSubject, emailBody)
                  setShowEmailModal(false)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Open Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
