import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { USER_ROLES, INVESTMENT_TYPES } from '../../utils/constants'

const PostCard = ({ post, onInvest }) => {
  const { user } = useAuth()
  const [showDetails, setShowDetails] = useState(false)

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
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDownload = (documentType) => {
    // This would typically download the document
    window.open(`/api/posts/${post._id}/documents/${documentType}`, '_blank')
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {post.companyLogo ? (
              <img 
                src={post.companyLogo} 
                alt={`${post.companyName} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {post.companyName?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {post.companyName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {post.sector}
                </span>
                <span className="text-gray-500 text-sm">
                  Posted {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(post.investmentAmount)}
            </div>
            <div className="text-sm text-gray-600">
              {post.investmentType === INVESTMENT_TYPES.EQUITY ? (
                `${post.equityPercentage}% Equity`
              ) : (
                'Debt Funding'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Post Type & Consultant Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {post.postType === 'seed' ? (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                🌱 Seed Funding
              </span>
            ) : (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                🚀 Startup Post
              </span>
            )}
          </div>
          
          {post.consultant && (
            <div className="text-sm text-gray-600">
              Consultant: <span className="font-medium">{post.consultant.name}</span>
            </div>
          )}
        </div>

        {/* Company Description */}
        {post.description && (
          <div className="mb-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {showDetails ? post.description : `${post.description?.substring(0, 150)}...`}
              {post.description?.length > 150 && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-blue-500 hover:text-blue-700 ml-1 text-sm font-medium"
                >
                  {showDetails ? 'Show less' : 'Read more'}
                </button>
              )}
            </p>
          </div>
        )}

        {/* Key Metrics */}
        {(post.teamSize || post.establishmentDate || post.website) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
            {post.teamSize && (
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{post.teamSize}</div>
                <div className="text-xs text-gray-600">Team Size</div>
              </div>
            )}
            {post.establishmentDate && (
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {new Date(post.establishmentDate).getFullYear()}
                </div>
                <div className="text-xs text-gray-600">Founded</div>
              </div>
            )}
            {post.website && (
              <div className="text-center">
                <a 
                  href={post.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        )}

        {/* Social Links */}
        {(post.socialLinks && Object.keys(post.socialLinks).length > 0) && (
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-sm text-gray-600">Follow:</span>
            {post.socialLinks.linkedin && (
              <a 
                href={post.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            {post.socialLinks.twitter && (
              <a 
                href={post.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
            {post.socialLinks.instagram && (
              <a 
                href={post.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <button
              onClick={() => handleDownload('onePager')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>One Pager</span>
            </button>
            
            <button
              onClick={() => handleDownload('pitchDeck')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Pitch Deck</span>
            </button>
          </div>

          {user && user.role === USER_ROLES.INVESTOR && (
            <button
              onClick={() => onInvest(post)}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="font-medium">Invest</span>
            </button>
          )}
        </div>
      </div>

      {/* Interest Indicators */}
      {post.investmentInterests && post.investmentInterests.length > 0 && (
        <div className="px-6 py-2 bg-yellow-50 border-t border-yellow-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-yellow-800">
              {post.investmentInterests.length} investor{post.investmentInterests.length !== 1 ? 's' : ''} interested
            </span>
            <span className="text-yellow-600">
              🔥 Hot Deal
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard