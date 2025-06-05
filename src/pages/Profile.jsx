import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400">Please login to access your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-slate-400">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                    <span className="text-white text-2xl font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    {user.isVerified ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                <p className="text-slate-400 capitalize text-sm">{user.role}</p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 px-3 bg-slate-700/30 rounded-lg">
                  <span className="text-slate-400 text-sm">Account Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isVerified 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Full Name</label>
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3">
                    <p className="text-white font-medium">{user.name}</p>
                  </div>
                </div>
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Email Address</label>
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3">
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>
                
                {/* Role Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Account Type</label>
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3">
                    <p className="text-white font-medium capitalize flex items-center">
                      {user.role}
                      <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                        {user.role === 'admin' ? 'Administrator' : user.role === 'startup' ? 'Startup' : 'Investor'}
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Verification Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Verification Status</label>
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        user.isVerified ? 'bg-green-400' : 'bg-yellow-400'
                      }`}></div>
                      <p className="text-white font-medium">
                        {user.isVerified ? 'Account Verified' : 'Verification Pending'}
                      </p>
                    </div>
                    {!user.isVerified && (
                      <p className="text-slate-400 text-xs mt-1">
                        Check your email for verification instructions
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-slate-700/50">
                <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
                
                <button className="px-6 py-2.5 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-all duration-200 font-medium border border-slate-600/50 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile