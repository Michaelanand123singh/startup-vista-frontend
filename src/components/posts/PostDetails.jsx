import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../services/api'
import { USER_ROLES, INVESTMENT_TYPES } from '../../utils/constants'
import InvestmentQuestions from '../investor/InvestmentQuestions'

const PostDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${id}`)
      setPost(response.data)
    } catch (err) {
      setError('Failed to load post details')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
    return `₹${amount?.toLocaleString()}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownload = (documentType) => {
    window.open(`/api/posts/${post._id}/documents/${documentType}`, '_blank')
  }

  const handleInvest = () => {
    setShowInvestmentModal(true)
  }

  const handleInvestmentSubmit = async (responses) => {
    try {
      await api.post(`/posts/${post._id}/invest`, {
        responses
      })
      
      // Refresh post to update interest count
      fetchPost()
      
      setShowInvestmentModal(false)
      
      // Show success message
      alert('Investment interest submitted successfully!')
    } catch (err) {
      alert('Failed to submit investment interest')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${post.companyName} - Investment Opportunity`,
        text: `Check out this investment opportunity in ${post.sector}`,
        url: window.location.href
      })
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
          {error || 'Post not found'}
        </div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'company', label: 'Company Info', icon: '🏢' },
    { id: 'financials', label: 'Financials', icon: '💰' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'documents', label: 'Documents', icon: '📄' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Posts</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </button>
              
              {user && user.role === USER_ROLES.INVESTOR && (
                <button
                  onClick={handleInvest}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="font-medium">Express Interest</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {post.companyLogo ? (
                <img 
                  src={post.companyLogo} 
                  alt={`${post.companyName} logo`}
                  className="w-20 h-20 rounded-xl object-cover shadow-md"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-2xl">
                    {post.companyName?.charAt(0)}
                  </span>
                </div>
              )}
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {post.companyName}
                </h1>
                <div className="flex items-center space-x-4 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {post.sector}
                  </span>
                  {post.postType === 'seed' ? (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      🌱 Seed Funding
                    </span>
                  ) : (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      🚀 Series Funding
                    </span>
                  )}
                </div>
                <p className="text-gray-600">
                  Posted on {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {formatCurrency(post.investmentAmount)}
              </div>
              <div className="text-lg text-gray-600 mb-2">
                {post.investmentType === INVESTMENT_TYPES.EQUITY ? (
                  `${post.equityPercentage}% Equity`
                ) : (
                  'Debt Funding'
                )}
              </div>
              {post.investmentInterests && post.investmentInterests.length > 0 && (
                <div className="flex items-center justify-end space-x-2 text-sm text-yellow-600">
                  <span>🔥</span>
                  <span>{post.investmentInterests.length} investors interested</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-100">
            {post.teamSize && (
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{post.teamSize}</div>
                <div className="text-sm text-gray-600">Team Members</div>
              </div>
            )}
            {post.establishmentDate && (
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {new Date(post.establishmentDate).getFullYear()}
                </div>
                <div className="text-sm text-gray-600">Founded</div>
              </div>
            )}
            {post.website && (
              <div className="text-center">
                <a 
                  href={post.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 font-medium"
                >
                  Visit Website
                </a>
                <div className="text-sm text-gray-600">Website</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {post.investmentType === INVESTMENT_TYPES.EQUITY ? 'Equity' : 'Debt'}
              </div>
              <div className="text-sm text-gray-600">Investment Type</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Company Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {post.description || 'No description provided.'}
                  </p>
                </div>

                {post.consultant && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Consultant Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">{post.consultant.name}</p>
                      <p className="text-gray-600 text-sm">Investment Consultant</p>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {(post.socialLinks && Object.keys(post.socialLinks).length > 0) && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Presence</h3>
                    <div className="flex items-center space-x-4">
                      {post.socialLinks.linkedin && (
                        <a 
                          href={post.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {post.socialLinks.twitter && (
                        <a 
                          href={post.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          <span>Twitter</span>
                        </a>
                      )}
                      {post.socialLinks.instagram && (
                        <a 
                          href={post.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z"/>
                          </svg>
                          <span>Instagram</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Company Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Company Name</span>
                        <span className="font-medium">{post.companyName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Sector</span>
                        <span className="font-medium">{post.sector}</span>
                      </div>
                      {post.establishmentDate && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Founded</span>
                          <span className="font-medium">{formatDate(post.establishmentDate)}</span>
                        </div>
                      )}
                      {post.teamSize && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Team Size</span>
                          <span className="font-medium">{post.teamSize} members</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      {post.website && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Website</span>
                          <a 
                            href={post.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-500 hover:text-blue-700"
                          >
                            Visit Site
                          </a>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Posted By</span>
                        <span className="font-medium">
                          {post.consultant ? post.consultant.name : 'Startup Team'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Investment Details</h3>
                    <div className="space-y-4">
                      <div className="bg-green-50 rounded-lg p-6">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {formatCurrency(post.investmentAmount)}
                        </div>
                        <div className="text-gray-700">
                          {post.investmentType === INVESTMENT_TYPES.EQUITY ? 
                            `Seeking for ${post.equityPercentage}% equity` : 
                            'Debt funding required'
                          }
                        </div>
                      </div>
                      
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">Investment Type</span>
                        <span className="font-medium capitalize">{post.investmentType}</span>
                      </div>
                      
                      {post.investmentType === INVESTMENT_TYPES.EQUITY && (
                        <div className="flex justify-between py-3 border-b border-gray-100">
                          <span className="text-gray-600">Equity Offered</span>
                          <span className="font-medium">{post.equityPercentage}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Interest Statistics</h3>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {post.investmentInterests ? post.investmentInterests.length : 0}
                        </div>
                        <div className="text-gray-700">Investors Interested</div>
                      </div>
                      
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">Post Status</span>
                        <span className="font-medium text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Team Information</h3>
                  <p className="text-gray-600">
                    Detailed team information will be shared after expressing investment interest.
                  </p>
                  {post.teamSize && (
                    <p className="text-gray-600 mt-2">
                      Team Size: <span className="font-medium">{post.teamSize} members</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Documents</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleDownload('onePager')}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">One Pager</div>
                        <div className="text-sm text-gray-600">Company overview and key metrics</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleDownload('pitchDeck')}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Pitch Deck</div>
                        <div className="text-sm text-gray-600">Detailed business presentation</div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Document Access
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Additional detailed documents including financial statements, legal documents, and detailed business plans will be shared after expressing investment interest and initial screening.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Posts or Call to Action */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Interested in this opportunity?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of investors who are already discovering and funding the next generation of successful startups through our platform.
          </p>
          
          {user && user.role === USER_ROLES.INVESTOR ? (
            <button
              onClick={handleInvest}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span>Express Investment Interest</span>
            </button>
          ) : user ? (
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
              <div className="text-yellow-600 mb-2">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-gray-700">
                Only investors can express interest in investment opportunities. 
                {user.role === USER_ROLES.STARTUP && ' As a startup, you can create your own posts to attract investors.'}
                {user.role === USER_ROLES.CONSULTANT && ' As a consultant, you can help startups create posts to attract investors.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700">Please sign in to express investment interest</p>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Investment Questions Modal */}
      {showInvestmentModal && (
        <InvestmentQuestions
          post={post}
          onSubmit={handleInvestmentSubmit}
          onClose={() => setShowInvestmentModal(false)}
        />
      )}
    </div>
  )
}

export default PostDetails