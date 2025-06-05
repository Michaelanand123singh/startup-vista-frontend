import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../services/api'

const StartupProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/startups/profile')
      setProfile(response.data)
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
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
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Complete Your Startup Profile</h2>
        <p className="text-gray-600 mb-6">
          Set up your profile to start connecting with investors and consultants
        </p>
        <button 
          onClick={() => window.location.href = '/profile/edit'}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Create Profile
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            {profile.logo && (
              <img 
                src={profile.logo} 
                alt={`${profile.companyName} logo`}
                className="w-16 h-16 rounded-lg object-cover mr-4"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.companyName}
              </h1>
              <p className="text-gray-600 mt-1">
                {profile.sector} • Founded {new Date(profile.establishmentDate).getFullYear()}
              </p>
              <p className="text-gray-600">
                Team Size: {profile.teamSize} members
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {profile.isVerified ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Verified
              </span>
            ) : (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Pending Verification
              </span>
            )}
          </div>
        </div>
      </div>

      {/* About Company */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">About Company</h2>
        <p className="text-gray-700 leading-relaxed">
          {profile.aboutCompany || 'No description provided'}
        </p>
      </div>

      {/* Product Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Product Information</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {profile.website && (
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <p className="font-medium">Website</p>
              <a 
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Visit Website
              </a>
            </div>
          )}
          
          {profile.androidApp && (
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-medium">Android App</p>
              <a 
                href={profile.androidApp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-700 text-sm"
              >
                Download
              </a>
            </div>
          )}
          
          {profile.iosApp && (
            <div className="text-center p-4 border rounded-lg">
              <div className="bg-gray-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-medium">iOS App</p>
              <a 
                href={profile.iosApp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Founders & Shareholders */}
      {profile.founders && profile.founders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Founders & Shareholders</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {profile.founders.map((founder, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{founder.fullName}</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {founder.sharePercentage}%
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{founder.designation}</p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {founder.email}
                  </p>
                  {founder.contactNo && (
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {founder.contactNo}
                    </p>
                  )}
                  {founder.linkedIn && (
                    <a 
                      href={founder.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Social Presence</h2>
        <div className="flex flex-wrap gap-4">
          {profile.socialLinks?.linkedIn && (
            <a 
              href={profile.socialLinks.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          )}
          
          {profile.socialLinks?.facebook && (
            <a 
              href={profile.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
          )}
          
          {profile.socialLinks?.instagram && (
            <a 
              href={profile.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.64 13.455 3.64 11.987c0-1.467.558-2.907 1.486-3.694.875-.807 2.026-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297.928.787 1.486 2.227 1.486 3.694 0 1.468-.558 2.908-1.486 3.695-.875.807-2.026 1.297-3.323 1.297zm7.108 0c-1.297 0-2.448-.49-3.323-1.297-.928-.787-1.486-2.227-1.486-3.695 0-1.467.558-2.907 1.486-3.694.875-.807 2.026-1.297 3.323-1.297 1.297 0 2.448.49 3.323 1.297.928.787 1.486 2.227 1.486 3.694 0 1.468-.558 2.908-1.486 3.695-.875.807-2.026 1.297-3.323 1.297z"/>
              </svg>
              Instagram
            </a>
          )}
          
          {profile.socialLinks?.twitter && (
            <a 
              href={profile.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </a>
          )}
        </div>
      </div>

      {/* Company Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Company Overview</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {new Date().getFullYear() - new Date(profile.establishmentDate).getFullYear()}
            </div>
            <p className="text-gray-600">Years in Business</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {profile.teamSize}
            </div>
            <p className="text-gray-600">Team Members</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {profile.sector}
            </div>
            <p className="text-gray-600">Industry Sector</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartupProfile