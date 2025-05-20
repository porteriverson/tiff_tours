import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabaseClient'

const TourImageManager = ({ tourId }: { tourId: string }) => {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const fetchImages = async () => {
      if (!tourId) return
      const { data, error } = await supabase
        .from('tours')
        .select('images')
        .eq('id', tourId)
        .single()

      if (error) {
        console.error('Error fetching tour images:', error)
        return
      }

      setImages(data?.images || [])
    }

    fetchImages()
  }, [tourId])

  const sanitizeFileName = (name: string) =>
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !tourId) return

    setUploading(true)
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const safeFileName = sanitizeFileName(file.name)
      const filePath = `${tourId}/${Date.now()}-${safeFileName}`

      const { error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      const { data: publicUrlData } = supabase.storage.from('tour-images').getPublicUrl(filePath)

      if (publicUrlData?.publicUrl) {
        newUrls.push(publicUrlData.publicUrl)
      }
    }

    const updatedImages = [...images, ...newUrls]

    const { error: updateError } = await supabase
      .from('tours')
      .update({ images: updatedImages })
      .eq('id', tourId)

    if (updateError) {
      console.error('Error updating images:', updateError)
    } else {
      setImages(updatedImages)
    }

    setUploading(false)
  }

  const deleteImage = async (url: string) => {
    const filePath = decodeURIComponent(url.split('/tour-images/')[1].split('?')[0])

    const { error: deleteError } = await supabase.storage.from('tour-images').remove([filePath])

    if (deleteError) {
      console.error('Error deleting image from storage:', deleteError)
      return
    }

    const updatedImages = images.filter((img) => img !== url)

    const { error: updateError } = await supabase
      .from('tours')
      .update({ images: updatedImages })
      .eq('id', tourId)

    if (updateError) {
      console.error('Error updating images after deletion:', updateError)
    } else {
      setImages(updatedImages)
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Upload Tour Images
      </label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="block text-sm text-white border border-gray-300 rounded cursor-pointer"
      />
      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.map((url, idx) => (
          <div key={idx} className="relative group">
            <img src={url} alt={`tour-img-${idx + 1}`} className="rounded shadow" />
            <button
              onClick={() => deleteImage(url)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TourImageManager
