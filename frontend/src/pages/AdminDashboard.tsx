import { UserRolesManager } from '../components/UserRolesManager'
import CreateTourForm from '../features/tours/CreateTourForm'
import TourList from '../features/tours/TourList'

function AdminDashboard() {
  return (
    <div className="min-h-screen min-w-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white px-4 py-18">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left Panel: Tour List */}
        <div className="md:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Tours</h2>
          <TourList />
          <CreateTourForm />
        </div>

        {/* Right Panel: Form and future features */}
        <div className="md:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Traveler Information</h2>
          <p>Future information about travelers to go here. </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 mx-auto justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <UserRolesManager />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
