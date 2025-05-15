import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    // { label: 'Request Info', path: '/request' },
    { label: 'Sign In', path: '/admin' },
    // Add more links as needed
  ]

  const handleNavClick = (path: string) => {
    setExpanded(false)
    navigate(path)
  }

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
          {navItems.map((item) => (
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
        </ul>
      </div>

      {/* Mobile Menu */}
      {expanded && (
        <div className="md:hidden px-6 pb-4 bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-2 text-gray-700">
            {navItems.map((item) => (
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
          </ul>
        </div>
      )}
    </nav>
  )
}

export default NavBar
