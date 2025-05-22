// src/features/admin/BookedList.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

interface UserProfile {
  email: string
}

interface BookedTraveler {
  id: string
  student_name: string
  student_gender: string
  room_preference_1: string | null
  room_preference_2: string | null
  room_preference_3: string | null
  medical_form_complete: boolean
  travel_forms_complete: boolean
  user: UserProfile
}

export const BookedList: React.FC<{ tourId: string }> = ({ tourId }) => {
  const [rows, setRows] = useState<BookedTraveler[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCell, setEditingCell] = useState<{
    id: string
    field: keyof Omit<BookedTraveler, 'id' | 'user'>
  } | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    const fetchRows = async () => {
      const { data, error } = await supabase
        .from('booked_travelers')
        .select(
          `
          id,
          student_name,
          student_gender,
          room_preference_1,
          room_preference_2,
          room_preference_3,
          medical_form_complete,
          travel_forms_complete,
          user:profiles(email)
        `
        )
        .eq('tour_id', tourId)

      if (error) {
        setError(error.message)
      } else if (data) {
        // Supabase always returns an array for joined tables, even when it's one-to-one.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalized: BookedTraveler[] = data.map((row: any) => ({
          id: row.id,
          student_name: row.student_name,
          student_gender: row.student_gender,
          room_preference_1: row.room_preference_1,
          room_preference_2: row.room_preference_2,
          room_preference_3: row.room_preference_3,
          medical_form_complete: row.medical_form_complete,
          travel_forms_complete: row.travel_forms_complete,
          user: Array.isArray(row.user) ? row.user[0] : row.user,
        }))
        setRows(normalized)
      }
      setLoading(false)
    }
    fetchRows()
  }, [tourId])

  const filtered = rows.filter((r) => {
    const term = search.toLowerCase()
    const boolToStr = (b: boolean) => (b ? 'yes' : 'no')
    return (
      r.student_name.toLowerCase().includes(term) ||
      r.student_gender.toLowerCase().includes(term) ||
      (r.room_preference_1 || '').toLowerCase().includes(term) ||
      (r.room_preference_2 || '').toLowerCase().includes(term) ||
      (r.room_preference_3 || '').toLowerCase().includes(term) ||
      boolToStr(r.medical_form_complete).includes(term) ||
      boolToStr(r.travel_forms_complete).includes(term)
    )
  })

  const toggleSelect = (id: string) => {
    const copy = new Set(selected)
    if (copy.has(id)) {
      copy.delete(id)
    } else {
      copy.add(id)
    }
    setSelected(copy)
  }

  const openEmailClient = () => {
    const recipients = rows
      .filter((r) => selected.has(r.id))
      .map((r) => r.user.email)
      .filter(Boolean)
      .join(',')
    const subject = 'Info about your booking'
    const body = `Hi,\n\nJust touching base about your upcoming tour booking.\n\n—Tiffany`
    window.location.href = `mailto:?bcc=${recipients}&subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  const handleCellSave = async (id: string, field: keyof Omit<BookedTraveler, 'id' | 'user'>) => {
    await supabase
      .from('booked_travelers')
      .update({ [field]: editValue })
      .eq('id', id)
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: editValue } : r)))
    setEditingCell(null)
  }

  const renderCell = (row: BookedTraveler, field: keyof Omit<BookedTraveler, 'id' | 'user'>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = String((row as any)[field] ?? '')
    if (editingCell?.id === row.id && editingCell.field === field) {
      return (
        <input
          className="w-full border px-1 py-0.5 rounded"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleCellSave(row.id, field)}
          onKeyDown={(e) => e.key === 'Enter' && handleCellSave(row.id, field)}
          autoFocus
        />
      )
    }
    return (
      <span
        className="block cursor-pointer"
        onDoubleClick={() => {
          setEditingCell({ id: row.id, field })
          setEditValue(value)
        }}
      >
        {value}
      </span>
    )
  }

  if (loading) return <p>Loading booked travelers…</p>
  if (error) return <p className="text-red-500">Error: {error}</p>
  if (!rows.length) return <p>No one has booked this tour yet.</p>

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-bold">Booked Travelers</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search any field…"
          className="px-3 py-2 border rounded shadow-sm text-sm"
        />
        {selected.size > 0 && (
          <button
            onClick={openEmailClient}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
          >
            Email {selected.size} Traveler{selected.size > 1 && 's'}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2 border text-center">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={(e) =>
                    setSelected(e.target.checked ? new Set(filtered.map((r) => r.id)) : new Set())
                  }
                />
              </th>
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-left">Gender</th>
              <th className="px-4 py-2 border text-left">Pref 1</th>
              <th className="px-4 py-2 border text-left">Pref 2</th>
              <th className="px-4 py-2 border text-left">Pref 3</th>
              <th className="px-4 py-2 border text-center">Med Form</th>
              <th className="px-4 py-2 border text-center">Travel Form</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-2 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggleSelect(r.id)}
                  />
                </td>
                <td className="px-4 py-2 border">{renderCell(r, 'student_name')}</td>
                <td className="px-4 py-2 border">{renderCell(r, 'student_gender')}</td>
                <td className="px-4 py-2 border">{renderCell(r, 'room_preference_1')}</td>
                <td className="px-4 py-2 border">{renderCell(r, 'room_preference_2')}</td>
                <td className="px-4 py-2 border">{renderCell(r, 'room_preference_3')}</td>
                <td className="px-4 py-2 border text-center">
                  {r.medical_form_complete ? '✅' : '❌'}
                </td>
                <td className="px-4 py-2 border text-center">
                  {r.travel_forms_complete ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
