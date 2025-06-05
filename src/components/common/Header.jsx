import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mr-3 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-sm">SV</span>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              StartupVista
            </span>
          </Link>
          
          <nav className="flex items-center space-x-1">
            {/* Browse Posts */}
            <Link 
              to="/posts" 
              className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
            >
              Browse
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-1 ml-2">
                {/* Dashboard */}
                <Link 
                  to="/dashboard" 
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
                >
                  Dashboard
                </Link>
                
                {/* Profile */}
                <Link 
                  to="/profile" 
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
                >
                  Profile
                </Link>
                
                {/* User Info */}
                <div className="flex items-center space-x-3 ml-3 pl-3 border-l border-slate-600/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-semibold">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-xs">
                      <div className="text-slate-200 font-medium">{user.name}</div>
                      <div className="text-slate-400 text-xs capitalize">{user.role}</div>
                    </div>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-red-500/25"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-1 ml-2">
                {/* Login */}
                <Link 
                  to="/login" 
                  className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                
                {/* Register Button */}
                <Link 
                  to="/register" 
                  className="px-4 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-500/25 ml-1"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header