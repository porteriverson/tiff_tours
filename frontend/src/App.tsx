import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import NavBar from './components/NavBar'
import AdminDashboard from './pages/AdminDashboard'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import ProtectedRoute from './features/auth/ProtectedRoute'
import ManageTourPage from './pages/ManageToursPage'

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/tours/:tourId"
            element={
              <ProtectedRoute requireAdmin>
                <ManageTourPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
