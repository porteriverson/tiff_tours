import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../services/supabaseClient'

const TourImageCarousel = ({ tourId }: { tourId: string }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  // Fetch image URLs from Supabase Storage
  useEffect(() => {
    const fetchImages = async () => {
      if (!tourId) return

      const { data, error } = await supabase.storage
        .from('tour-images')
        .list(tourId, { limit: 100 })

      if (error) {
        console.error('Error fetching images:', error)
        return
      }

      const urls: string[] = data
        .filter((file) => file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i))
        .map(
          (file) =>
            supabase.storage.from('tour-images').getPublicUrl(`${tourId}/${file.name}`).data
              .publicUrl
        )

      setImageUrls(urls)
    }

    fetchImages()
  }, [tourId])

  // Auto-play every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imageUrls.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [imageUrls.length])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const nextSlide = () => setCurrent((prev) => (prev + 1) % imageUrls.length)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX
    if (diff > 50) nextSlide()
    else if (diff < -50) prevSlide()
    touchStartX.current = null
  }

  if (imageUrls.length === 0) {
    return <p className="text-gray-500">No tour images found.</p>
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'h-screen fixed top-0 left-0 z-50 bg-black' : 'h-96'} overflow-hidden rounded shadow`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={imageUrls[current]}
        alt={`Tour image ${current + 1}`}
        className="object-cover w-full h-full transition duration-300 cursor-pointer"
        onClick={toggleFullscreen}
      />
      {imageUrls.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevSlide()
            }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 text-black rounded-full p-2"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextSlide()
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 text-black rounded-full p-2"
          >
            ›
          </button>
        </>
      )}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-60 px-3 py-1 rounded"
        >
          Close
        </button>
      )}
    </div>
  )
}

export default TourImageCarousel
