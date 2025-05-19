import Hero from '../components/Hero'

function AboutPage() {
  return (
    <>
      <div className="pt-[64px]">
        <Hero
          image="/eiffelTower.jpg"
          title="About Me"
          subtitle="Adventure is out there"
          // buttonText="Join the Adventure"
          // buttonLink="/tours"
        />
        <div className="min-w-screen items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
          <div className="flex justify-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">About Page</h1>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutPage
