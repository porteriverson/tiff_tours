import { Facebook, Instagram, Plane } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 mt-auto min-w-screen border-t-4 border-sky-500">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-400">
                Tiffany's Tours
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Creating unforgettable educational travel experiences for students and families since
              1995.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-sky-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/tours"
                  className="text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Tours
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-amber-400">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/faq"
                  className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Follow Us</h4>
            <p className="text-slate-400 text-sm mb-4">
              Stay connected for the latest tours and travel tips!
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/share/g/197CurC3uB/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="bg-slate-800 hover:bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a
                href="https://www.instagram.com/tiffanys_tours?igsh=djl3OHF2eTg3NTA="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="bg-slate-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <Instagram size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-6">
          {/* Copyright */}
          <div className="text-center text-sm text-slate-400">
            <p>&copy; {currentYear} Tiffany's Tours. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
