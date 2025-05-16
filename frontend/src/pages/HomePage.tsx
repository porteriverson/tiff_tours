import PublishedTourList from '../features/tours/PublishedTourList'

function HomePage() {
  return (
    <>
      <div className="flex min-w-screen items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
        <div>
          <h1 className="flex m-24">Home Page</h1>
        </div>
        <div className="flex justify-center">
          <PublishedTourList />
        </div>
      </div>
    </>
  )
}
export default HomePage
