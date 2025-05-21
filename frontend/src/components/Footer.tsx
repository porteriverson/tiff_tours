import { Facebook, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto min-w-screen">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Links Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/tours" className="hover:underline">
                Tours
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Resources</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4 justify-center">
            <a
              href="https://www.facebook.com/share/g/197CurC3uB/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-red-500 hover:text-blue-600"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://www.instagram.com/tiffanys_tours?igsh=djl3OHF2eTg3NTA="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            {/* <a
              href="https://linkedin.com/company/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a> */}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 text-center text-sm mt-8">
        &copy; {currentYear} Tiff Tours. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
