import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { AddTravelerForm } from '../features/user/AddTravelerForm'
import Hero from '../components/Hero'

function TravelerSignupPage() {
  const navigate = useNavigate()
  const { tourId } = useParams<{ tourId: string }>()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getSessionUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
      else {
        navigate('/login')
      }
    }

    getSessionUser()
  }, [navigate])

  if (!tourId) return <p>Invalid tour ID.</p>
  if (!userId) return <p>Loading...</p>

  return (
    <>
      <div>
        <Hero
          image="/eiffelTower.jpg"
          title="Title"
          subtitle="Adventure is out there"
          // buttonText="Join the Adventure"
          // buttonLink="/tours"
        />
      </div>
      <div className="p-4 items-center justify-between text-center min-w-screen">
        <AddTravelerForm tourId={tourId} userId={userId} />
      </div>
    </>
  )
}

export default TravelerSignupPage
