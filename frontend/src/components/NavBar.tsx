import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import type { User } from '@supabase/supabase-js'

const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const handleNavClick = (path: string) => {
    setExpanded(false)
    navigate(path)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/') // Redirect after logout
  }

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo & Branding */}
        <div
          className="flex items-center cursor-pointer text-2xl font-bold text-indigo-600 space-x-2"
          onClick={() => handleNavClick('/')}
        >
          <img src="/tiff-logo.png" alt="Tiff Tours Logo" className="h-8 w-8" />
          <span>Tiff Tours</span>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setExpanded(!expanded)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {expanded ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-800 font-medium">
          {[
            { label: 'Home', path: '/' },
            { label: 'About', path: '/about' },
          ].map((item) => (
            <li key={item.path}>
              <span
                onClick={() => handleNavClick(item.path)}
                className={`cursor-pointer hover:text-indigo-400 transition-colors  ${
                  location.pathname === item.path ? 'text-indigo-600 font-semibold underline' : ''
                }`}
              >
                {item.label}
              </span>
            </li>
          ))}
          {user && (
            <>
              <li>
                <span
                  onClick={() => handleNavClick('/admin')}
                  className={`cursor-pointer hover:text-indigo-400 transition-colors ${
                    location.pathname === '/admin' ? 'text-indigo-600 font-semibold underline' : ''
                  }`}
                >
                  Dashboard
                </span>
              </li>
              <li>
                <span
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-700 font-semibold hover:underline"
                >
                  Log Out
                </span>
              </li>
            </>
          )}

          {!user && (
            <span
              onClick={() => handleNavClick('/admin')}
              className={`cursor-pointer hover:text-indigo-400 transition-colors  ${
                location.pathname === '/admin' ? 'text-indigo-600 font-semibold underline' : ''
              }`}
            >
              Sign In
            </span>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {expanded && (
        <div className="md:hidden px-6 pb-4 bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-2 text-gray-700">
            {[
              { label: 'Home', path: '/' },
              { label: 'About', path: '/about' },
            ].map((item) => (
              <li key={item.path}>
                <span
                  onClick={() => handleNavClick(item.path)}
                  className={`block w-full cursor-pointer py-2 hover:text-indigo-500 ${
                    location.pathname === item.path ? 'text-indigo-600 font-semibold underline' : ''
                  }`}
                >
                  {item.label}
                </span>
              </li>
            ))}
            <li>
              {user ? (
                <span
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-semibold py-2"
                >
                  Log Out
                </span>
              ) : (
                <span
                  onClick={() => handleNavClick('/admin')}
                  className={`block w-full cursor-pointer py-2 hover:text-indigo-500 ${
                    location.pathname === '/admin' ? 'text-indigo-600 font-semibold underline' : ''
                  }`}
                >
                  Sign In
                </span>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}

export default NavBar
