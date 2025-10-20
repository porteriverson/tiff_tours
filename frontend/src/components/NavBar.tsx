import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import type { User } from '@supabase/supabase-js'
import { Plane, X, Menu } from 'lucide-react'

const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  const handleNavClick = (path: string) => {
    setExpanded(false)
    navigate(path)
  }

  const handleDashboardClick = () => {
    setExpanded(false)
    if (userRole === 'admin') {
      navigate('/admin')
    } else if (userRole === 'traveler') {
      navigate('/traveler')
    } else {
      navigate('/')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserRole(null)
    setExpanded(false)
    navigate('/')
  }

  const fetchUserAndRole = async (session: { user: User } | null) => {
    if (session?.user) {
      setUser(session.user)
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching user profile:', error)
          setUserRole(null)
        } else {
          setUserRole(profile?.role || null)
        }
      } catch (e) {
        console.error('An unexpected error occurred:', e)
        setUserRole(null)
      }
    } else {
      setUser(null)
      setUserRole(null)
    }
  }

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await fetchUserAndRole(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Tours', path: '/tours' },
  ]

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div
            className="flex items-center cursor-pointer space-x-3 group"
            onClick={() => handleNavClick('/')}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <Plane className="w-6 h-6 text-sky-600 group-hover:text-sky-700 transition-colors" />
            </div>
            <span className="text-xl font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
              Tiffany's Tours
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`text-sm font-medium transition-colors relative ${
                  location.pathname === item.path
                    ? 'text-sky-600'
                    : 'text-slate-700 hover:text-sky-600'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-sky-600"></span>
                )}
              </button>
            ))}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-slate-200">
              {user ? (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === '/admin' || location.pathname === '/traveler'
                        ? 'text-sky-600'
                        : 'text-slate-700 hover:text-sky-600'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick('/login')}
                  className="px-4 py-2 text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 transition-all rounded shadow-sm hover:shadow-md"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-700 hover:text-sky-600 transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {expanded && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Auth */}
            <div className="pt-3 mt-3 border-t border-slate-100">
              {user ? (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === '/admin' || location.pathname === '/traveler'
                        ? 'text-sky-600 bg-sky-50'
                        : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-slate-50 transition-colors"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick('/login')}
                  className="block w-full px-4 py-3 text-sm font-medium text-center bg-sky-600 text-white hover:bg-sky-700 transition-all rounded shadow-sm hover:shadow-md"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar
