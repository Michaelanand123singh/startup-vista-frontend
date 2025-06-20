import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { USER_ROLES } from '../../utils/constants'
import { FaGoogle, FaExclamationTriangle } from 'react-icons/fa'
import RoleSelect from './RoleSelect' // Import your RoleSelect component

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null)
  
  const { register, signInWithGoogle, updateUserRole, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already authenticated and has role
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, user, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.role) {
      setError('Please select a role')
      return
    }

    setLoading(true)
    setError('')

    try {
      await register(formData)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError('')
    
    try {
      const userData = await signInWithGoogle()
      
      // Check if user already has a role
      if (userData.role) {
        // User already has role, redirect to dashboard
        navigate('/dashboard')
      } else {
        // New user without role, show role selection
        setPendingGoogleUser(userData)
        setShowRoleSelection(true)
      }
    } catch (err) {
      setError(err.message || 'Google sign-up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleSelect = async (selectedRole) => {
    if (!selectedRole || !pendingGoogleUser) return

    setLoading(true)
    setError('')

    try {
      // Update user role
      await updateUserRole(selectedRole)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to update role. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // If showing role selection after Google sign-in
  if (showRoleSelection && pendingGoogleUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl mr-3 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">SV</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                StartupVista
              </span>
            </Link>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome, {pendingGoogleUser.name}!</h2>
              <p className="text-slate-400">Please select your role to complete your registration</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm flex items-start">
                <FaExclamationTriangle className="flex-shrink-0 mt-0.5 mr-2" />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-8">
              <label className="block text-slate-300 text-sm font-semibold mb-3">
                Choose Your Role
              </label>
              <div className="space-y-3">
                {roleOptions.map((option) => (
                  <label 
                    key={option.value} 
                    className={`flex items-start p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.role === option.value 
                        ? 'bg-blue-500/10 border border-blue-500/30' 
                        : 'bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50 hover:border-slate-500/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={handleChange}
                      className="mt-1 mr-3 text-blue-500 focus:ring-blue-500/50 focus:ring-2"
                      required
                      disabled={loading}
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="text-lg mr-2">{option.icon}</span>
                        <span className="text-white font-semibold">{option.label}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleRoleSelect(formData.role)}
              disabled={loading || !formData.role}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Completing Registration...
                </div>
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const roleOptions = [
    { value: USER_ROLES.STARTUP, label: 'Startup Founder', icon: '🚀', description: 'Looking for funding and growth opportunities' },
    { value: USER_ROLES.INVESTOR, label: 'Investor', icon: '💰', description: 'Seeking promising investment opportunities' },
    { value: USER_ROLES.CONSULTANT, label: 'Consultant', icon: '🎯', description: 'Providing expert advice and services' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl mr-3 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">SV</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              StartupVista
            </span>
          </Link>
        </div>

        {/* Register Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Join StartupVista</h2>
            <p className="text-slate-400">Create your account and start connecting</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm flex items-start">
              <FaExclamationTriangle className="flex-shrink-0 mt-0.5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                placeholder="Create a strong password"
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-slate-500">
                Minimum 8 characters with at least one number and special character
              </p>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-semibold mb-3">
                Choose Your Role
              </label>
              <div className="space-y-3">
                {roleOptions.map((option) => (
                  <label 
                    key={option.value} 
                    className={`flex items-start p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.role === option.value 
                        ? 'bg-blue-500/10 border border-blue-500/30' 
                        : 'bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50 hover:border-slate-500/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={handleChange}
                      className="mt-1 mr-3 text-blue-500 focus:ring-blue-500/50 focus:ring-2"
                      required
                      disabled={loading}
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="text-lg mr-2">{option.icon}</span>
                        <span className="text-white font-semibold">{option.label}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600/50"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-slate-800/50 text-slate-400 text-sm">OR</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-6 bg-white text-slate-800 font-semibold rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-slate-500/10 transform hover:scale-[1.02]"
            >
              <FaGoogle className="mr-3 text-blue-500" />
              Continue with Google
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-slate-400 hover:text-slate-300 transition-colors duration-200">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-slate-400 hover:text-slate-300 transition-colors duration-200">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register