import { useEffect, useState, type JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../services/supabaseClient'
import type { Session } from '@supabase/supabase-js'

interface ProtectedRouteProps {
  children: JSX.Element
  requireAdmin?: boolean
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const getSessionAndRole = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData.session
      setSession(session)

      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching user role:', error)
          setIsAdmin(false)
        } else {
          setIsAdmin(profile.role === 'admin')
        }
      }

      setLoading(false)
    }

    getSessionAndRole()

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
