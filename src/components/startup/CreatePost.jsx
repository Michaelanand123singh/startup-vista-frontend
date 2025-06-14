import React, { useState } from 'react'
import { api } from '../../services/api' // Import your API service
import { useAuth } from '../../hooks/useAuth' // Import useAuth hook

const CreatePost = () => {
  const { user, isAuthenticated } = useAuth() // Get user authentication state
  
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    investmentAmount: '',
    investmentType: '',
    equityPercentage: '',
    description: '',
    consultant: 'StartupVista'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const sectors = [
    'Technology',
    'Healthcare',
    'Finance',
    'E-commerce',
    'Education',
    'Manufacturing',
    'Real Estate',
    'Food & Beverage',
    'Transportation',
    'Energy',
    'Entertainment',
    'Other'
  ]

  const investmentTypes = [
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Bridge',
    'Convertible Note',
    'Equity'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    const { companyName, sector, investmentAmount, investmentType } = formData

    if (!companyName.trim()) {
      setError('Company name is required')
      return false
    }

    if (!sector) {
      setError('Please select a sector')
      return false
    }

    if (!investmentAmount || investmentAmount <= 0) {
      setError('Please enter a valid investment amount')
      return false
    }

    if (!investmentType) {
      setError('Please select an investment type')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Check authentication first
    if (!isAuthenticated) {
      setError('You must be logged in to create a post')
      return
    }

    // Check user role
    if (!user?.role || user.role !== 'startup') {
      setError('Only startup founders can create investment posts')
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Prepare data for API call
      const postData = {
        companyName: formData.companyName.trim(),
        sector: formData.sector,
        investmentAmount: Number(formData.investmentAmount),
        investmentType: formData.investmentType,
        equityPercentage: formData.equityPercentage ? Number(formData.equityPercentage) : undefined,
        consultant: formData.consultant || 'StartupVista',
        description: formData.description.trim()
      }

      // Make actual API call to create post
      const response = await postsAPI.createPost(postData)
      
      console.log('Post created successfully:', response.data)
      setSuccess('Post created successfully!')
      
      // Reset form after successful creation
      setFormData({
        companyName: '',
        sector: '',
        investmentAmount: '',
        investmentType: '',
        equityPercentage: '',
        description: '',
        consultant: 'StartupVista'
      })

      // Optional: Redirect to posts page after success
      // setTimeout(() => {
      //   window.location.href = '/posts'
      // }, 2000)
      
    } catch (error) {
      console.error('Error creating post:', error)
      
      // Handle specific error cases
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.')
      } else if (error.response?.status === 403) {
        setError('You do not have permission to create posts.')
      } else if (error.response?.status === 400) {
        setError('Invalid data provided. Please check your inputs.')
      } else {
        setError('Failed to create post. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Show message if user is not authenticated or not a startup
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600">Please log in to create investment posts.</p>
          </div>
        </div>
      </div>
    )
  }

  if (user?.role !== 'startup') {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
            <p className="text-gray-600">Only startup founders can create investment posts.</p>
            <p className="text-sm text-gray-500 mt-2">Your current role: {user?.role || 'Unknown'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Investment Post</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
                Sector *
              </label>
              <select
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select a sector</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Investment Amount ($) *
                </label>
                <input
                  type="number"
                  id="investmentAmount"
                  name="investmentAmount"
                  placeholder="e.g., 100000"
                  value={formData.investmentAmount}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="equityPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                  Equity Percentage (%)
                </label>
                <input
                  type="number"
                  id="equityPercentage"
                  name="equityPercentage"
                  placeholder="e.g., 10"
                  value={formData.equityPercentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="investmentType" className="block text-sm font-medium text-gray-700 mb-1">
                Investment Type *
              </label>
              <select
                id="investmentType"
                name="investmentType"
                value={formData.investmentType}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select investment type</option>
                {investmentTypes.map(type => (
                  <option key={type} value={type.toLowerCase().replace(' ', '-')}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="consultant" className="block text-sm font-medium text-gray-700 mb-1">
                Consultant
              </label>
              <input
                type="text"
                id="consultant"
                name="consultant"
                placeholder="Consultant name"
                value={formData.consultant}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your investment opportunity..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => window.history.back()}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost