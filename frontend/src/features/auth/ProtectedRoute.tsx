import { useEffect, useState, type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'
import type { Session } from '@supabase/supabase-js';


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Get the current session on mount
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }

    getSession()

    // Optional: Listen for auth changes (e.g., auto sign-out)
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
