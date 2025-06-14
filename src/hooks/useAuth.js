import { useContext, useDebugValue, useMemo } from 'react'
import { AuthContext } from '../context/AuthContext'
import { USER_ROLES } from '../utils/constants'

/**
 * Enhanced authentication hook with role-based utilities
 * @returns {{
 *   user: object|null,
 *   currentUser: object|null,
 *   isLoading: boolean,
 *   loading: boolean,
 *   error: Error|null,
 *   login: function,
 *   logout: function,
 *   signInWithGoogle: function,
 *   refreshToken: function,
 *   isAuthenticated: boolean,
 *   isAdmin: boolean,
 *   isStartup: boolean,
 *   isInvestor: boolean,
 *   isConsultant: boolean,
 *   isVerified: boolean,
 *   hasRole: function,
 *   canAccess: function,
 *   getRoleTitle: function,
 *   getRoleColor: function,
 *   updateProfile: function,
 *   clearError: function
 * }}
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  // Enhanced error message with troubleshooting tip
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure your component is wrapped in <AuthProvider> at the application root.'
    )
  }

  // Add debug value for React DevTools
  useDebugValue(
    context.currentUser 
      ? `${context.currentUser.email} (${context.currentUser.role})`
      : 'Not authenticated'
  )

  // Memoize enhanced context to prevent unnecessary re-renders
  const enhancedAuth = useMemo(() => {
    const user = context.currentUser || context.user
    
    // Role checking utilities
    const hasRole = (role) => {
      if (!user) return false
      if (Array.isArray(role)) {
        return role.includes(user.role)
      }
      return user.role === role
    }

    const canAccess = (allowedRoles) => {
      if (!user) return false
      if (!allowedRoles || allowedRoles.length === 0) return true
      return hasRole(allowedRoles)
    }

    // Role display utilities
    const getRoleTitle = (role = user?.role) => {
      switch (role) {
        case USER_ROLES.STARTUP:
          return 'Startup Founder'
        case USER_ROLES.INVESTOR:
          return 'Investment Partner'
        case USER_ROLES.CONSULTANT:
          return 'Growth Consultant'
        case USER_ROLES.ADMIN:
          return 'Platform Administrator'
        default:
          return 'Platform Member'
      }
    }

    const getRoleColor = (role = user?.role) => {
      switch (role) {
        case USER_ROLES.STARTUP:
          return 'from-orange-500 to-red-500'
        case USER_ROLES.INVESTOR:
          return 'from-green-500 to-emerald-500'
        case USER_ROLES.CONSULTANT:
          return 'from-purple-500 to-indigo-500'
        case USER_ROLES.ADMIN:
          return 'from-blue-500 to-cyan-500'
        default:
          return 'from-gray-500 to-slate-500'
      }
    }

    // Enhanced authentication methods with error handling
    const login = async (email, password) => {
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      if (typeof email !== 'string' || typeof password !== 'string') {
        throw new Error('Email and password must be strings')
      }
      
      try {
        return await context.login(email, password)
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    }

    const logout = async () => {
      try {
        await context.logout()
      } catch (error) {
        console.error('Logout failed:', error)
        throw error
      }
    }

    const signInWithGoogle = async () => {
      try {
        return await context.signInWithGoogle()
      } catch (error) {
        console.error('Google sign-in failed:', error)
        throw error
      }
    }

    const refreshToken = async () => {
      try {
        return await context.refreshToken()
      } catch (error) {
        console.error('Token refresh failed:', error)
        throw error
      }
    }

    const updateProfile = async (profileData) => {
      if (!user) {
        throw new Error('User must be authenticated to update profile')
      }
      
      try {
        return await context.updateProfile(profileData)
      } catch (error) {
        console.error('Profile update failed:', error)
        throw error
      }
    }

    const clearError = () => {
      if (context.clearError) {
        context.clearError()
      }
    }

    return {
      // User data (support both naming conventions)
      user,
      currentUser: user,
      
      // Loading states (support both naming conventions)
      isLoading: context.loading || context.isLoading || false,
      loading: context.loading || context.isLoading || false,
      
      // Error state
      error: context.error || null,
      
      // Authentication methods
      login,
      logout,
      signInWithGoogle,
      refreshToken,
      updateProfile,
      clearError,
      
      // Authentication status
      isAuthenticated: !!user,
      
      // Role-based properties
      isAdmin: hasRole(USER_ROLES.ADMIN),
      isStartup: hasRole(USER_ROLES.STARTUP),
      isInvestor: hasRole(USER_ROLES.INVESTOR),
      isConsultant: hasRole(USER_ROLES.CONSULTANT),
      isVerified: user?.isVerified || false,
      
      // Role utilities
      hasRole,
      canAccess,
      getRoleTitle,
      getRoleColor,
      
      // User profile data
      name: user?.name || user?.displayName || '',
      email: user?.email || '',
      role: user?.role || null,
      profilePicture: user?.profilePicture || user?.photoURL || null,
      
      // Additional utilities
      isProfileComplete: () => {
        if (!user) return false
        const requiredFields = ['name', 'email', 'role']
        return requiredFields.every(field => user[field])
      },
      
      getInitials: () => {
        if (!user?.name) return '??'
        return user.name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      },
      
      // Role-specific permissions
      canCreatePost: () => {
        return hasRole([USER_ROLES.STARTUP, USER_ROLES.CONSULTANT])
      },
      
      canViewInvestments: () => {
        return hasRole([USER_ROLES.INVESTOR, USER_ROLES.CONSULTANT, USER_ROLES.ADMIN])
      },
      
      canManageUsers: () => {
        return hasRole(USER_ROLES.ADMIN)
      }
    }
  }, [context])

  return enhancedAuth
}

// Export additional utility functions for use outside components
export const authUtils = {
  /**
   * Check if user has required role without hook
   */
  hasRole: (user, role) => {
    if (!user || !role) return false
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    return user.role === role
  },
  
  /**
   * Get role display title
   */
  getRoleTitle: (role) => {
    switch (role) {
      case USER_ROLES.STARTUP:
        return 'Startup Founder'
      case USER_ROLES.INVESTOR:
        return 'Investment Partner'
      case USER_ROLES.CONSULTANT:
        return 'Growth Consultant'
      case USER_ROLES.ADMIN:
        return 'Platform Administrator'
      default:
        return 'Platform Member'
    }
  },
  
  /**
   * Validate email format
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  /**
   * Validate password strength
   */
  isValidPassword: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  }
}