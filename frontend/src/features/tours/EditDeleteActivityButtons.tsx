import { useState } from 'react'
import { supabase } from '../../services/supabaseClient'
import { AddActivityModal } from './AddActivityModal'

interface Props {
  id: string
  itineraryDayId: string
  initialData: {
    start_time: string
    end_time: string
    description: string
    location_name: string
    city: string
    country: string
  }
  onChange: () => void // callback to refetch activities
}

export const EditDeleteActivityButtons: React.FC<Props> = ({ id, initialData, onChange }) => {
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this activity?')) return

    setDeleting(true)
    const { error } = await supabase.from('itinerary_activities').delete().eq('id', id)

    setDeleting(false)
    if (error) {
      setError(error.message)
    } else {
      onChange()
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <button onClick={() => setShowModal(true)} className="text-blue-600 hover:underline text-sm">
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:underline text-sm"
        disabled={deleting}
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
      {error && <span className="text-red-500 text-xs">{error}</span>}

      {showModal && (
        <AddActivityModal
          show={showModal}
          onClose={() => setShowModal(false)}
          tourId={''} // not needed for edit
          date={''} // not needed for edit
          dayNumber={0} // not needed for edit
          activityId={id}
          initialData={initialData}
          onSuccess={() => {
            setShowModal(false)
            onChange()
          }}
        />
      )}
    </div>
  )
}
