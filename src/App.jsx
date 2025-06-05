import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Loader from './components/common/Loader'

// Auth Components
import Login from './components/auth/Login'
import Register from './components/auth/Register'

// Page Components
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Posts from './pages/Posts'
import NotFound from './pages/NotFound'

// Post Components
import PostDetails from './components/posts/PostDetails'

// Role-specific Components
import StartupForm from './components/startup/StartupForm'
import InvestorForm from './components/investor/InvestorForm'
import ConsultantForm from './components/consultant/ConsultantForm'
import CreatePost from './components/startup/CreatePost'
import CreateSeedPost from './components/consultant/CreateSeedPost'

import { USER_ROLES } from './utils/constants'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// Main App Layout Component
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/posts/:id" element={<PostDetails />} />
      
      {/* Auth Routes - Only accessible when not logged in */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Protected Routes - Require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      {/* Role-specific Profile Setup Routes */}
      <Route 
        path="/setup/startup" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.STARTUP]}>
            <StartupForm />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/setup/investor" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.INVESTOR]}>
            <InvestorForm />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/setup/consultant" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.CONSULTANT]}>
            <ConsultantForm />
          </ProtectedRoute>
        } 
      />

      {/* Post Creation Routes */}
      <Route 
        path="/create-post" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.STARTUP]}>
            <CreatePost />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/create-seed-post" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.CONSULTANT]}>
            <CreateSeedPost />
          </ProtectedRoute>
        } 
      />

      {/* Startup-specific Routes */}
      <Route 
        path="/my-posts" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.STARTUP, USER_ROLES.CONSULTANT]}>
            <MyPosts />
          </ProtectedRoute>
        } 
      />

      {/* Investor-specific Routes */}
      <Route 
        path="/my-investments" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.INVESTOR]}>
            <MyInvestments />
          </ProtectedRoute>
        } 
      />

      {/* Consultant-specific Routes */}
      <Route 
        path="/my-clients" 
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.CONSULTANT]}>
            <MyClients />
          </ProtectedRoute>
        } 
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

// Placeholder components for routes that don't exist yet
const MyPosts = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">My Posts</h1>
      <p className="text-gray-600">Manage your investment posts here.</p>
    </div>
  </div>
)

const MyInvestments = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">My Investments</h1>
      <p className="text-gray-600">Track your investment interests and portfolio here.</p>
    </div>
  </div>
)

const MyClients = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">My Clients</h1>
      <p className="text-gray-600">Manage your startup clients and seed posts here.</p>
    </div>
  </div>
)

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </Router>
    </AuthProvider>
  )
}

export default App