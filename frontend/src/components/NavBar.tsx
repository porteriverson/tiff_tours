import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import type { User } from '@supabase/supabase-js'

const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showToursDropdown, setShowToursDropdown] = useState(false)
  const [showToursMobile, setShowToursMobile] = useState(false)

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
          <img src="/TTLogo.png" alt="Tiff Tours Logo" className="h-8 w-8" />
          <span className="text-gray-800">Tiffany's Tours</span>
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
        <ul className="hidden md:flex space-x-6 text-gray-800 font-medium items-center">
          {/* Other top-level links like Home, About, etc. */}
          {[
            { label: 'Home', path: '/' },
            { label: 'About', path: '/about' },
            // { label: 'Join the Adventure', path: '/join' },
            // { label: 'Student Traveler', path: '/student' },
          ].map((item) => (
            <li key={item.path}>
              <span
                onClick={() => handleNavClick(item.path)}
                className={`cursor-pointer hover:text-indigo-400 transition-colors ${
                  location.pathname === item.path ? 'text-indigo-600 font-semibold underline' : ''
                }`}
              >
                {item.label}
              </span>
            </li>
          ))}
          <li>
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setShowToursDropdown(true)}
              onMouseLeave={() => setShowToursDropdown(false)}
            >
              <span className="hover:text-indigo-400 transition-colors">Tours</span>
              {showToursDropdown && (
                <ul className="absolute mt-2 bg-white border rounded shadow text-left text-sm z-50">
                  {[
                    { label: 'Upcoming', path: '/tours/upcoming' },
                    { label: 'Previous', path: '/tours/previous' },
                  ].map((item) => (
                    <li
                      key={item.path}
                      className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                      onClick={() => handleNavClick(item.path)}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>

          {/* Auth buttons */}
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
            <li>
              <span
                onClick={() => handleNavClick('/admin')}
                className={`cursor-pointer hover:text-indigo-400 transition-colors ${
                  location.pathname === '/admin' ? 'text-indigo-600 font-semibold underline' : ''
                }`}
              >
                Sign In
              </span>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {expanded && (
        <div className="md:hidden px-6 pb-4 bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-2 text-gray-700 items-start">
            {/* Tours dropdown toggle */}

            {/* Other pages */}
            {[
              { label: 'Home', path: '/' },
              { label: 'About', path: '/about' },
              // { label: 'Join the Adventure', path: '/join' },
              // { label: 'Student Traveler', path: '/student' },
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
              <div
                className="flex justify-between items-center cursor-pointer py-2"
                onClick={() => setShowToursMobile(!showToursMobile)}
              >
                <span className="font-medium">Tours</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={showToursMobile ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                  />
                </svg>
              </div>
              {showToursMobile && (
                <ul className="pl-4 space-y-2 items-start">
                  <li
                    onClick={() => handleNavClick('/tours/upcoming')}
                    className="cursor-pointer hover:text-indigo-500"
                  >
                    Upcoming Tours
                  </li>
                  <li
                    onClick={() => handleNavClick('/tours/previous')}
                    className="cursor-pointer hover:text-indigo-500"
                  >
                    Previous Tours
                  </li>
                </ul>
              )}
            </li>

            {/* Auth */}
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
              {user ? (
                <span
                  onClick={handleLogout}
                  className="block w-full text-red-600 hover:text-red-700 font-semibold py-2"
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
