import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

interface InterestedStudent {
  id: string
  student_name: string
  student_email: string
  student_school: string
  grad_year: string
  gpa: string
}

export const InterestedList = ({ tourId }: { tourId: string }) => {
  const [students, setStudents] = useState<InterestedStudent[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCell, setEditingCell] = useState<{
    id: string
    field: keyof InterestedStudent
  } | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase
        .from('potential_travelers')
        .select('id, student_name, student_email, student_school, grad_year, gpa')
        .eq('tour_id', tourId)

      if (error) {
        setError(error.message)
      } else {
        setStudents(data || [])
      }

      setLoading(false)
    }

    fetchStudents()
  }, [tourId])

  const filtered = students.filter((s) => {
    const lower = search.toLowerCase()
    return (
      s.student_name.toLowerCase().includes(lower) ||
      s.student_email.toLowerCase().includes(lower) ||
      s.student_school.toLowerCase().includes(lower) ||
      s.grad_year.toLowerCase().includes(lower) ||
      s.gpa.toLowerCase().includes(lower)
    )
  })

  const toggleSelect = (id: string) => {
    const newSet = new Set(selected)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelected(newSet)
  }

  const openEmailClient = () => {
    const recipients = students.filter((s) => selected.has(s.id))
    const emails = recipients.map((s) => s.student_email).join(',')
    const subject = 'More Info on Your Upcoming Tour'
    const body = `Hi there,\n\nThanks for your interest in the upcoming tour! We’ll be in touch soon with more details.\n\nBest,\nTiffany`
    window.location.href = `mailto:?bcc=${emails}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleCellSave = async (id: string, field: keyof InterestedStudent) => {
    await supabase
      .from('potential_travelers')
      .update({ [field]: editValue })
      .eq('id', id)
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: editValue } : s)))
    setEditingCell(null)
  }

  const renderCell = (student: InterestedStudent, field: keyof InterestedStudent) => {
    return editingCell?.id === student.id && editingCell.field === field ? (
      <input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => handleCellSave(student.id, field)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleCellSave(student.id, field)
        }}
        autoFocus
        className="w-full border px-1 py-0.5 rounded"
      />
    ) : (
      <span
        onDoubleClick={() => {
          setEditingCell({ id: student.id, field })
          setEditValue(student[field])
        }}
        className="block cursor-pointer"
      >
        {student[field]}
      </span>
    )
  }

  if (loading) return <p>Loading interested students...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>
  if (students.length === 0) return <p>No interested students yet.</p>

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-lg font-bold text-start">Interested Students</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search any field..."
          className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300 text-sm"
        />
        {selected.size > 0 && (
          <button
            onClick={openEmailClient}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm"
          >
            Email {selected.size} Student{selected.size > 1 ? 's' : ''}
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
                      setSelected(new Set(filtered.map((s) => s.id)))
                    } else {
                      setSelected(new Set())
                    }
                  }}
                  checked={selected.size === filtered.length && filtered.length > 0}
                />
              </th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">School</th>
              <th className="px-4 py-2 border">Grad Year</th>
              <th className="px-4 py-2 border">GPA</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t text-left">
                <td className="px-2 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggleSelect(s.id)}
                  />
                </td>
                <td className="px-4 py-2 border">{renderCell(s, 'student_name')}</td>
                <td className="px-4 py-2 border">{renderCell(s, 'student_email')}</td>
                <td className="px-4 py-2 border">{renderCell(s, 'student_school')}</td>
                <td className="px-4 py-2 border">{renderCell(s, 'grad_year')}</td>
                <td className="px-4 py-2 border">{renderCell(s, 'gpa')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
