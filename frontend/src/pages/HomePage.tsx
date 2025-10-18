import Hero from '../components/Hero'
import YouTubeEmbed from '../components/YoutubeEmbed'
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
        <div className="min-w-screen items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
          <div className="flex justify-center">
            <PublishedTourList />
          </div>
          <div className="max-w-4xl mx-auto my-auto">
            <YouTubeEmbed embedId="GWMi6WgZfl4" />
          </div>
        </div>
      </div>
    </>
  )
}
export default HomePage
