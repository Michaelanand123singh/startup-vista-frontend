import { useState, useEffect } from 'react'
import { auth } from '../firebase/config'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { api } from '../services/api'

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRoleSelect, setShowRoleSelect] = useState(false)
  const [firebaseUserData, setFirebaseUserData] = useState(null)

  // Handle Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get Firebase ID token
          const idToken = await firebaseUser.getIdToken()
          
          // Try to authenticate with backend
          const response = await api.post('/auth/firebase', { idToken })
          
          if (response.data.user) {
            setUser(response.data.user)
            localStorage.setItem('token', response.data.token)
            setShowRoleSelect(false)
            setFirebaseUserData(null)
          }
        } catch (error) {
          console.error('Backend authentication error:', error)
          
          // Check if this is a new user needing role selection
          if (error.response?.status === 409 && error.response?.data?.isNewUser) {
            setFirebaseUserData({
              name: firebaseUser.displayName,
              email: firebaseUser.email,
              picture: firebaseUser.photoURL,
              uid: firebaseUser.uid
            })
            setShowRoleSelect(true)
          } else {
            setError(error.response?.data?.message || 'Authentication failed')
          }
        }
      } else {
        // User signed out
        setUser(null)
        setShowRoleSelect(false)
        setFirebaseUserData(null)
        localStorage.removeItem('token')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      
      const result = await signInWithPopup(auth, provider)
      
      // The onAuthStateChanged listener will handle the rest
      return result.user
      
    } catch (error) {
      console.error('Google sign-in error:', error)
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Sign-in failed. Please try again.'
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in was cancelled. Please try again.'
          break
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked. Please allow popups and try again.'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please wait a moment and try again.'
          break
        default:
          errorMessage = error.message || errorMessage
      }
      
      setError(errorMessage)
      setLoading(false)
      throw error
    }
  }

  const completeRegistration = async (selectedRole) => {
    if (!selectedRole) {
      throw new Error('Role selection is required')
    }

    try {
      setLoading(true)
      setError(null)
      
      // Get current Firebase user's ID token
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('No authenticated user found')
      }

      const idToken = await currentUser.getIdToken(true) // Force refresh
      
      // Complete registration with selected role
      const response = await api.post('/auth/complete-firebase-signup', {
        idToken,
        role: selectedRole,
        name: firebaseUserData?.name,
        email: firebaseUserData?.email,
        picture: firebaseUserData?.picture
      })

      if (response.data.user) {
        setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        setShowRoleSelect(false)
        setFirebaseUserData(null)
        return response.data.user
      }
    } catch (error) {
      console.error('Registration completion error:', error)
      
      let errorMessage = 'Failed to complete registration. Please try again.'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      // Sign out from Firebase
      await firebaseSignOut(auth)
      
      // Clear backend session if exists
      try {
        await api.post('/auth/logout')
      } catch (logoutError) {
        // Ignore logout errors as user is already signed out from Firebase
        console.warn('Backend logout failed:', logoutError)
      }
      
      // Clear local state
      setUser(null)
      setShowRoleSelect(false)
      setFirebaseUserData(null)
      setError(null)
      localStorage.removeItem('token')
      
    } catch (error) {
      console.error('Sign out error:', error)
      setError('Failed to sign out. Please try again.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const refreshToken = async () => {
    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        const idToken = await currentUser.getIdToken(true)
        const response = await api.post('/auth/refresh', { idToken })
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          return response.data.token
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    error,
    showRoleSelect,
    firebaseUserData,
    signInWithGoogle,
    completeRegistration,
    signOut,
    clearError,
    refreshToken
  }
}