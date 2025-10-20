import AboutContent from '../features/about/AboutContent'

function AboutPage() {
  return (
    <>
      <div className="">
        <div className="min-w-screen items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4 pt-16">
          <div className="flex justify-center">
            <AboutContent />
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutPage
