import { useState } from 'react'
import { supabase } from '../../services/supabaseClient'

interface RecommendationFormData {
  teacherName: string
  teacherSchool: string
  teacherEmail: string
  studentName: string
  studentEmail: string
  studentSchool: string
  gradYear: string
  gpa: string
  comments: string
}

const RecommendationForm = () => {
  const [formData, setFormData] = useState<RecommendationFormData>({
    teacherName: '',
    teacherSchool: '',
    teacherEmail: '',
    studentName: '',
    studentEmail: '',
    studentSchool: '',
    gradYear: '',
    gpa: '',
    comments: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase.from('potential_travelers').insert([
      {
        teacher_name: formData.teacherName,
        teacher_school: formData.teacherSchool,
        teacher_email: formData.teacherEmail,
        student_name: formData.studentName,
        student_email: formData.studentEmail,
        student_school: formData.studentSchool,
        grad_year: formData.gradYear,
        gpa: formData.gpa,
        comments: formData.comments,
      },
    ])

    setSubmitting(false)

    if (error) {
      console.error('Error submitting recommendation:', error)
      setError('There was an error submitting the recommendation.')
    } else {
      setSuccess(true)
      setFormData({
        teacherName: '',
        teacherSchool: '',
        teacherEmail: '',
        studentName: '',
        studentEmail: '',
        studentSchool: '',
        gradYear: '',
        gpa: '',
        comments: '',
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-800 dark:text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Recommend a Student</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">Recommendation submitted successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Teacher Fields */}
        <div>
          <label className="block text-sm mb-1">
            <span className="text-red-500">*</span>Teacher Name
          </label>
          <input
            name="teacherName"
            value={formData.teacherName}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Teacher Email</label>
          <input
            name="teacherEmail"
            type="email"
            value={formData.teacherEmail}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">School</label>
          <input
            name="teacherSchool"
            value={formData.teacherSchool}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* Student Fields */}
        <div>
          <label className="block text-sm mb-1">
            <span className="text-red-500">*</span>Student Name
          </label>
          <input
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Student Email</label>
          <input
            name="studentEmail"
            type="email"
            value={formData.studentEmail}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">
            <span className="text-red-500">*</span>Student School
          </label>
          <input
            name="studentSchool"
            value={formData.studentSchool}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">
              <span className="text-red-500">*</span>Graduation Year
            </label>
            <input
              name="gradYear"
              value={formData.gradYear}
              onChange={handleChange}
              required
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">GPA</label>
            <input
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Comments</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows={3}
            className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Recommendation'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RecommendationForm
