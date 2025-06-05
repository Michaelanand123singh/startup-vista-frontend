import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../services/api'
import { SECTORS, INVESTMENT_TYPES } from '../../utils/constants'

const InvestorProfile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/investors/profile')
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
        <h2 className="text-2xl font-bold mb-4">Complete Your Investor Profile</h2>
        <p className="text-gray-600 mb-6">
          Set up your profile to start discovering investment opportunities
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

  const totalInvestments = profile.pastInvestments?.reduce((sum, inv) => sum + inv.amount, 0) || 0
  const totalCurrentHoldings = profile.currentHoldings?.reduce((sum, holding) => sum + holding.investment, 0) || 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.fullName}
            </h1>
            <p className="text-gray-600 mt-2">Investor Profile</p>
            {profile.linkedIn && (
              <a 
                href={profile.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 mt-2 inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn Profile
              </a>
            )}
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

      {/* Investment Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalInvestments.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m-5 0h2m5 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Current Holdings</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalCurrentHoldings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Portfolio Companies</p>
              <p className="text-2xl font-bold text-gray-900">
                {(profile.pastInvestments?.length || 0) + (profile.currentHoldings?.length || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Preferences */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Investment Preferences</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Ticket Size</h3>
            <p className="text-gray-600">
              ₹{profile.investmentPreferences?.minTicketSize?.toLocaleString() || 'N/A'} - 
              ₹{profile.investmentPreferences?.maxTicketSize?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Preferred Sectors</h3>
            <div className="flex flex-wrap gap-2">
              {profile.investmentPreferences?.preferredSectors?.map((sector, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                >
                  {sector}
                </span>
              )) || <span className="text-gray-500">Not specified</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Past Investments */}
      {profile.pastInvestments && profile.pastInvestments.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Past Investments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Company</th>
                  <th className="text-left py-2">Investment</th>
                  <th className="text-left py-2">Exit Amount</th>
                  <th className="text-left py-2">Returns</th>
                </tr>
              </thead>
              <tbody>
                {profile.pastInvestments.map((investment, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{investment.companyName}</td>
                    <td className="py-2">₹{investment.investment?.toLocaleString()}</td>
                    <td className="py-2">₹{investment.exitAmount?.toLocaleString()}</td>
                    <td className="py-2">
                      {investment.exitAmount && investment.investment ? (
                        <span className={`font-medium ${
                          investment.exitAmount > investment.investment 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {((investment.exitAmount / investment.investment - 1) * 100).toFixed(1)}%
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Current Holdings */}
      {profile.currentHoldings && profile.currentHoldings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Current Holdings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Company</th>
                  <th className="text-left py-2">Investment</th>
                  <th className="text-left py-2">Funding Type</th>
                </tr>
              </thead>
              <tbody>
                {profile.currentHoldings.map((holding, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{holding.companyName}</td>
                    <td className="py-2">₹{holding.investment?.toLocaleString()}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        holding.fundingType === 'equity' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {holding.fundingType?.charAt(0).toUpperCase() + holding.fundingType?.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Contact Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{profile.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone</p>
            <p className="font-medium">{profile.contactNo || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestorProfile