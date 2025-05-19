import Hero from '../components/Hero'

function AboutPage() {
  return (
    <>
      <div className="pt-[64px]">
        <Hero
          image="/eiffelTower.jpg"
          title="About Me"
          subtitle="Oh, the places you'll go!"
          buttonText="Join the Adventure"
          buttonLink="/tours"
        />
        <div className="flex min-w-screen items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">About Page</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              This is the about page of our application.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutPage
