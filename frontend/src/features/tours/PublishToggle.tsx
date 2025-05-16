import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

interface PublishToggleButtonProps {
  tourId: string
  initialPublished: boolean
  onToggle?: (newStatus: boolean) => void
}

export const PublishToggle: React.FC<PublishToggleButtonProps> = ({
  tourId,
  initialPublished,
  onToggle,
}) => {
  const [isPublished, setIsPublished] = useState(initialPublished)
  const [loading, setLoading] = useState(false)

  // Sync state if the prop changes externally (like after fetch)
  useEffect(() => {
    setIsPublished(initialPublished)
  }, [initialPublished])

  const handleToggle = async () => {
    setLoading(true)
    const newStatus = !isPublished

    const { error } = await supabase
      .from('tours')
      .update({ is_published: newStatus })
      .eq('id', tourId)

    setLoading(false)

    if (error) {
      console.error('Failed to update publish status:', error)
      alert('Something went wrong. Try again.')
    } else {
      setIsPublished(newStatus)
      onToggle?.(newStatus)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-6 py-2 rounded transition text-white ${
        isPublished ? 'bg-red-700 hover:bg-red-800' : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      {loading ? 'Processing...' : isPublished ? 'Unpublish' : 'Publish'}
    </button>
  )
}
