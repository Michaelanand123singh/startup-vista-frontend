import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import ConsultantForm from './ConsultantForm'

const ConsultantProfile = ({ userId, isOwner = false }) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/consultants/${userId}`)
      setProfile(response.data)
    } catch (error) {
      console.error('Error fetching consultant profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = (updatedData) => {
    setProfile(updatedData)
    setEditing(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchProfile}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No profile found</p>
        {isOwner && (
          <button 
            onClick={() => setEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Profile
          </button>
        )}
      </div>
    )
  }

  if (editing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <button
            onClick={() => setEditing(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        <ConsultantForm 
          initialData={profile} 
          onSubmit={handleUpdateProfile}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{profile.fullName}</h1>
              <p className="text-blue-100 text-lg">Investment Consultant</p>
            </div>
            {isOwner && (
              <button
                onClick={() => setEditing(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="px-6 py-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {profile.contactNo && (
              <div className="flex items-center">
                <span className="text-gray-500 font-medium w-24">Phone:</span>
                <span className="text-gray-800">{profile.contactNo}</span>
              </div>
            )}
            {profile.linkedIn && (
              <div className="flex items-center">
                <span className="text-gray-500 font-medium w-24">LinkedIn:</span>
                <a 
                  href={profile.linkedIn} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Investment Statistics */}
        <div className="px-6 py-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Investment Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Total Investment</h3>
              <p className="text-2xl font-bold text-green-600">
                {profile.totalInvestment ? formatCurrency(profile.totalInvestment) : 'Not specified'}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Startups Funded</h3>
              <p className="text-2xl font-bold text-blue-600">
                {profile.totalStartupsFunded || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        {profile.portfolio && profile.portfolio.length > 0 && (
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Investment Portfolio</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                      Company Name
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                      Investment Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profile.portfolio.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-gray-800">
                        {item.companyName || 'N/A'}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-800">
                        {item.investmentAmount ? formatCurrency(item.investmentAmount) : 'Not disclosed'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConsultantProfile