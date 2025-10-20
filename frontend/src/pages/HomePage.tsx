import Hero from '../components/Hero'
import PublishedTourList from '../features/tours/PublishedTourList'

function HomePage() {
  return (
    <>
      <div className="pt-[64px]">
        <Hero
          image="/eiffelSunset.png"
          title="Tiffany's Tours"
          subtitle="Oh, the places you'll go!"
          // buttonText="Join the Adventure"
          // buttonLink="/tours"
        />
        <div className="min-w-screen items-center justify-center min-h-screen bg-gray-100 text-center">
          <div className="flex justify-center min-w-screen">
            <PublishedTourList />
          </div>
        </div>
      </div>
    </>
  )
}
export default HomePage
