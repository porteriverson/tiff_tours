import UserChecklist from '../features/user/UserChecklist'

function TravelerDashboard() {
  return (
    <div className="min-h-screen min-w-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white container mx-auto px-4 pb-16 sm:px-6 lg:px-8 pt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Traveler Dashboard</h1>

      {/* Two-column grid that stacks on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tour Checklist</h2>
          <UserChecklist />
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Tour Itinerary</h2>
        </section>
      </div>

      {/* RecommendedList below on all viewports */}
      <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Extra Space</h2>
      </section>
      <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Bottom Section</h2>
      </section>
    </div>
  )
}

export default TravelerDashboard
