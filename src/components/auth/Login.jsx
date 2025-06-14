import { useState, useEffect } from 'react'
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth'
import { useNavigate, Link } from 'react-router-dom'
import RoleSelect from './RoleSelect'
import { FaGoogle, FaExclamationTriangle } from 'react-icons/fa'

const Login = () => {
  const {
    user,
    loading,
    error,
    showRoleSelect,
    firebaseUserData,
    signInWithGoogle,
    completeRegistration,
    clearError
  } = useFirebaseAuth()

  const [selectedRole, setSelectedRole] = useState('')
  const [completingRegistration, setCompletingRegistration] = useState(false)
  const navigate = useNavigate()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !showRoleSelect) {
      navigate('/dashboard')
    }
  }, [user, showRoleSelect, navigate])

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error('Google login failed:', err)
    }
  }

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      alert('Please select a role to continue')
      return
    }

    setCompletingRegistration(true)
    try {
      await completeRegistration(selectedRole)
    } catch (error) {
      console.error('Role selection error:', error)
    } finally {
      setCompletingRegistration(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-3 text-white text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  // Show role selection for new users
  if (showRoleSelect && firebaseUserData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                {firebaseUserData.picture ? (
                  <img 
                    src={firebaseUserData.picture} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {firebaseUserData.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome, {firebaseUserData.name}!
              </h1>
              <p className="text-slate-400">
                Choose your role to get started with StartupVista
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm flex items-start">
                <FaExclamationTriangle className="flex-shrink-0 mt-0.5 mr-2" />
                <div className="flex-1">
                  <span>{error}</span>
                  <button 
                    onClick={clearError}
                    className="block text-red-300 underline text-sm mt-1 hover:text-red-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <RoleSelect 
              selectedRole={selectedRole}
              onRoleSelect={setSelectedRole}
            />

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleRoleSelection}
                disabled={!selectedRole || completingRegistration}
                className={`
                  px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg transform hover:scale-[1.02]
                  ${selectedRole && !completingRegistration
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-blue-500/25' 
                    : 'bg-slate-600 cursor-not-allowed opacity-50'
                  }
                `}
              >
                {completingRegistration ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting up your account...
                  </div>
                ) : (
                  'Continue to Dashboard'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Regular login form
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

        {/* Login Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to StartupVista</h2>
            <p className="text-slate-400">Connect with startups, investors, and consultants</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm flex items-start">
              <FaExclamationTriangle className="flex-shrink-0 mt-0.5 mr-2" />
              <div className="flex-1">
                <span>{error}</span>
                <button 
                  onClick={clearError}
                  className="block text-red-300 underline text-sm mt-1 hover:text-red-200 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-6 bg-white text-slate-800 font-semibold rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-slate-500/10 transform hover:scale-[1.02]"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              <>
                <FaGoogle className="mr-3 text-blue-500" />
                Continue with Google
              </>
            )}
          </button>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              By signing in, you agree to our{' '}
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
    </div>
  )
}

export default Login