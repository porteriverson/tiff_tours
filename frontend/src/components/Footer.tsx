// src/components/Footer.tsx

const Footer = () => {
  return (
    <footer className="min-w-screen bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} Tiff Tours. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
