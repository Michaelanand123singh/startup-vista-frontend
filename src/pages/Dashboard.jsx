import { useAuth } from '../context/AuthContext'
import { USER_ROLES } from '../utils/constants'
import { Link, useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Access Required</h2>
          <p className="text-slate-400">Please login to access your dashboard</p>
        </div>
      </div>
    )
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.STARTUP:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case USER_ROLES.INVESTOR:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case USER_ROLES.CONSULTANT:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.STARTUP:
        return 'from-orange-500 to-red-500'
      case USER_ROLES.INVESTOR:
        return 'from-green-500 to-emerald-500'
      case USER_ROLES.CONSULTANT:
        return 'from-purple-500 to-indigo-500'
      default:
        return 'from-blue-500 to-purple-500'
    }
  }

  const getRoleTitle = (role) => {
    switch (role) {
      case USER_ROLES.STARTUP:
        return 'Startup Founder'
      case USER_ROLES.INVESTOR:
        return 'Investment Partner'
      case USER_ROLES.CONSULTANT:
        return 'Growth Consultant'
      default:
        return 'Platform Member'
    }
  }

  const handleCreatePost = () => {
    navigate('/create-post')
  }

  const handleCreateSeedPost = () => {
    navigate('/create-seed-post')
  }

  const handleViewMyPosts = () => {
    navigate('/my-posts')
  }

  const handleViewPortfolio = () => {
    navigate('/my-investments')
  }

  const handleViewClients = () => {
    navigate('/my-clients')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${getRoleColor(user.role)} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <div className="text-white">
                    {getRoleIcon(user.role)}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user.name}
                  </h1>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 bg-gradient-to-r ${getRoleColor(user.role)} text-white text-sm rounded-full font-medium`}>
                      {getRoleTitle(user.role)}
                    </span>
                    {user.isVerified && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm">Dashboard Overview</p>
                <p className="text-slate-300 text-lg font-semibold">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Specific Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {user.role === USER_ROLES.STARTUP && (
            <>
              <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    Create Funding Post
                  </h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Showcase your startup and attract potential investors with detailed funding requirements
                </p>
                <button 
                  onClick={handleCreatePost}
                  className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium shadow-lg hover:shadow-orange-500/25"
                >
                  Create Post
                </button>
              </div>

              <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-slate-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center shadow-lg mr-4 border border-slate-600/50">
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-slate-300 transition-colors">
                    My Funding Posts
                  </h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Manage and track performance of your published funding posts and investor engagement
                </p>
                <button 
                  onClick={handleViewMyPosts}
                  className="w-full px-4 py-3 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-all duration-200 font-medium border border-slate-600/50"
                >
                  View My Posts
                </button>
              </div>
            </>
          )}

          {user.role === USER_ROLES.INVESTOR && (
            <>
              <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
                    Discover Opportunities
                  </h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Explore curated startup investment opportunities across various sectors and stages
                </p>
                <Link
                  to="/posts"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-green-500/25 text-center"
                >
                  Browse Opportunities
                </Link>
              </div>

              <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-slate-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center shadow-lg mr-4 border border-slate-600/50">
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-slate-300 transition-colors">
                    Investment Portfolio
                  </h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Monitor your investment interests, track due diligence, and manage your startup portfolio
                </p>
                <button 
                  onClick={handleViewPortfolio}
                  className="w-full px-4 py-3 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-all duration-200 font-medium border border-slate-600/50"
                >
                  View Portfolio
                </button>
              </div>
            </>
          )}

          {user.role === USER_ROLES.CONSULTANT && (
            <>
              <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    Create Seed Post
                  </h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Post seed funding opportunities and connect promising startups with early-stage investors
                </p>
                <button 
                  onClick={handleCreateSeedPost}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 font-medium shadow-lg hover:shadow-purple-500/25"
                >
                  Create Seed Post
                </button>
              </div>

              <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-slate-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center shadow-lg mr-4 border border-slate-600/50">
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-slate-300 transition-colors">
                    Startup Portfolio
                  </h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Track and manage your portfolio of startups, monitor their growth and success metrics
                </p>
                <button 
                  onClick={handleViewClients}
                  className="w-full px-4 py-3 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-all duration-200 font-medium border border-slate-600/50"
                >
                  View Portfolio
                </button>
              </div>
            </>
          )}

          {/* Universal Profile Card */}
          <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                Profile Settings
              </h3>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Complete your profile, verify your account, and enhance your platform presence
            </p>
            <Link
              to="/profile"
              className="block w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25 text-center"
            >
              Update Profile
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">24</div>
            <div className="text-xs text-slate-400">Active Connections</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">12</div>
            <div className="text-xs text-slate-400">Recent Views</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">8</div>
            <div className="text-xs text-slate-400">Messages</div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">95%</div>
            <div className="text-xs text-slate-400">Profile Complete</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard