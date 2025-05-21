import { RecommendedList } from '../features/admin/RecommendedList'
import { UserRolesManager } from '../features/admin/UserRolesManager'
import CreateTourForm from '../features/tours/CreateTourForm'
import TourList from '../features/tours/TourList'

function AdminDashboard() {
  return (
    <div className="min-h-screen min-w-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white container mx-auto px-4 pb-16 sm:px-6 lg:px-8 pt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      {/* Two-column grid that stacks on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Tours</h2>
          <TourList />
          <CreateTourForm />
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Roles</h2>
          <UserRolesManager />
        </section>
      </div>

      {/* RecommendedList below on all viewports */}
      <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Recommended</h2>
        <RecommendedList />
      </section>
    </div>
  )
}

export default AdminDashboard
