import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      // Optionally redirect to login
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Authentication API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  firebase: (idToken) => api.post('/auth/firebase', { idToken })
}

// Profile management methods
export const profileAPI = {
  updateProfile: (role, data) => api.put('/users/profile', { [role]: data }),
  getProfile: () => api.get('/users/profile'),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// Posts API methods
export const postsAPI = {
  // Get all posts
  getAllPosts: () => api.get('/posts'),
  
  // Create a new post
  createPost: (postData) => api.post('/posts', postData),
  
  // Get a specific post by ID
  getPost: (postId) => api.get(`/posts/${postId}`),
  
  // Update a post (if you add this feature later)
  updatePost: (postId, postData) => api.put(`/posts/${postId}`, postData),
  
  // Delete a post (if you add this feature later)
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  
  // Express interest in a post (for investors)
  expressInterest: (postId, answers) => api.post(`/posts/${postId}/interest`, { answers }),
  
  // Get posts by user (if you add this feature)
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  
  // Get posts by sector (if you add filtering)
  getPostsBySector: (sector) => api.get(`/posts?sector=${sector}`),
  
  // Search posts (if you add search functionality)
  searchPosts: (query) => api.get(`/posts/search?q=${query}`)
}

// File upload API methods
export const uploadAPI = {
  uploadLogo: (formData) => api.post('/uploads/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadDocument: (formData) => api.post('/uploads/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadVerification: (formData) => api.post('/uploads/verification', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// Startup-specific API methods
export const startupAPI = {
  getStartups: () => api.get('/startups'),
  getStartup: (id) => api.get(`/startups/${id}`),
  updateStartupProfile: (data) => api.put('/startups/profile', data)
}

// Investor-specific API methods
export const investorAPI = {
  getInvestors: () => api.get('/investors'),
  getInvestor: (id) => api.get(`/investors/${id}`),
  updateInvestorProfile: (data) => api.put('/investors/profile', data),
  getInvestmentInterests: () => api.get('/investors/interests')
}

// Consultant-specific API methods
export const consultantAPI = {
  getConsultants: () => api.get('/consultants'),
  getConsultant: (id) => api.get(`/consultants/${id}`),
  updateConsultantProfile: (data) => api.put('/consultants/profile', data)
}

// Backward compatibility - keep existing exports
export const updateProfile = profileAPI.updateProfile
export const getProfile = profileAPI.getProfile

// Default export for the main api instance
export default api