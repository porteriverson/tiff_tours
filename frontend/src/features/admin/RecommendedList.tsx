// src/features/potentialTravelers/TeacherList.tsx

import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

interface PotentialTraveler {
  id: string
  teacher_name: string
  teacher_email: string
  student_name: string
  student_email: string
  student_school: string
  grad_year: string
  gpa: string
}

export const RecommendedList = () => {
  const [records, setRecords] = useState<PotentialTraveler[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCell, setEditingCell] = useState<{
    id: string
    field: keyof PotentialTraveler
  } | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from('potential_travelers')
        .select(
          'id, teacher_name, teacher_email, student_name, student_email, student_school, grad_year, gpa'
        )
        .not('teacher_name', 'is', null)

      if (error) {
        setError(error.message)
      } else {
        setRecords(data || [])
      }
      setLoading(false)
    }
    fetchRecords()
  }, [])

  const filtered = records.filter((r) => {
    const lower = search.toLowerCase()
    return (
      r.teacher_name.toLowerCase().includes(lower) ||
      r.teacher_email.toLowerCase().includes(lower) ||
      r.student_name.toLowerCase().includes(lower) ||
      r.student_email.toLowerCase().includes(lower) ||
      r.student_school.toLowerCase().includes(lower) ||
      r.grad_year.toLowerCase().includes(lower) ||
      r.gpa.toLowerCase().includes(lower)
    )
  })

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelected(next)
  }

  const openEmailClient = () => {
    const recipients = records.filter((r) => selected.has(r.id))
    const emails = recipients.map((r) => r.student_email).join(',')
    const subject = 'More Info on Your Upcoming Tour'
    const body = `Hi there,\n\nThanks for your interest in our tours! We’ll be in touch soon with more details.\n\nBest,\nTiffany`
    window.location.href = `mailto:?bcc=${emails}&subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
  }

  const handleCellSave = async (id: string, field: keyof PotentialTraveler) => {
    await supabase
      .from('potential_travelers')
      .update({ [field]: editValue })
      .eq('id', id)

    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: editValue } : r)))
    setEditingCell(null)
  }

  const renderCell = (r: PotentialTraveler, field: keyof PotentialTraveler) => {
    const raw = r[field] ?? '' // ← default null to ''
    const isEditing = editingCell?.id === r.id && editingCell.field === field

    return isEditing ? (
      <input
        className="w-full border px-1 py-0.5 rounded"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => handleCellSave(r.id, field)}
        onKeyDown={(e) => e.key === 'Enter' && handleCellSave(r.id, field)}
        autoFocus
      />
    ) : (
      <span
        className="block cursor-pointer"
        onDoubleClick={() => {
          setEditingCell({ id: r.id, field })
          setEditValue(raw) // ← start with the normalized string
        }}
      >
        {raw}
      </span>
    )
  }

  if (loading) return <p>Loading teacher-recommendations…</p>
  if (error) return <p className="text-red-500">Error: {error}</p>
  if (records.length === 0) return <p>No teacher-recommended travelers found.</p>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-lg font-bold text-start">Teacher Recommendations</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search any field…"
          className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300 text-sm"
        />
        {selected.size > 0 && (
          <button
            onClick={openEmailClient}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
          >
            Email {selected.size} Teacher
            {selected.size > 1 ? 's' : ''}
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
                  onChange={(e) =>
                    setSelected(e.target.checked ? new Set(filtered.map((r) => r.id)) : new Set())
                  }
                  checked={selected.size === filtered.length && filtered.length > 0}
                />
              </th>
              <th className="px-4 py-2 border">Teacher Name</th>
              <th className="px-4 py-2 border">Teacher Email</th>
              <th className="px-4 py-2 border">Student Name</th>
              <th className="px-4 py-2 border">Student Email</th>
              <th className="px-4 py-2 border">School</th>
              <th className="px-4 py-2 border">Grad Year</th>
              <th className="px-4 py-2 border">GPA</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t text-left">
                <td className="px-2 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggleSelect(r.id)}
                  />
                </td>
                <td className="px-4 py-2 border">{renderCell(r, 'teacher_name')}</td>
                <td className="px-4 py-2 border">{renderCell(r, 'teacher_email')}</td>
                <td className="px-4 py-2 border">{renderCell(r, 'student_name')}</td>
                <td className="px-4 py-2 border">{renderCell(r, 'student_email')}</td>
                <td className="px-4 py-2 border">{renderCell(r, 'student_school')}</td>
                <td className="px-4 py-2 border">{renderCell(r, 'grad_year')}</td>
                <td className="px-4 py-2 border">{renderCell(r, 'gpa')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
