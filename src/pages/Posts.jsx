import { useState, useEffect } from 'react'
import { api } from '../services/api'
import Loader from '../components/common/Loader'

const Posts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts')
      setPosts(response.data)
    } catch (err) {
      setError('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = filter === 'all' ? posts : posts.filter(post => 
    post.sector?.toLowerCase().includes(filter.toLowerCase())
  )

  const sectors = [...new Set(posts.map(post => post.sector).filter(Boolean))]

  if (loading) return <Loader />

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 shadow-2xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">Connection Error</h2>
          <p className="text-slate-400">{error}</p>
          <button 
            onClick={fetchPosts}
            className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/30"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Investment Opportunities
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Discover promising startups and groundbreaking innovations ready for investment
          </p>
        </div>

        {/* Filter Section */}
        {sectors.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50'
                }`}
              >
                All Sectors
              </button>
              {sectors.slice(0, 6).map((sector) => (
                <button
                  key={sector}
                  onClick={() => setFilter(sector)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                    filter === sector
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50'
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 shadow-2xl max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Opportunities Yet</h3>
              <p className="text-slate-400">
                {filter === 'all' 
                  ? 'Be the first to discover amazing investment opportunities' 
                  : `No opportunities found in ${filter} sector`}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div 
                key={post._id} 
                className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Company Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {post.companyName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30 capitalize">
                        {post.sector}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30 capitalize">
                        {post.investmentType}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {post.companyName?.charAt(0)?.toUpperCase() || 'S'}
                    </span>
                  </div>
                </div>

                {/* Investment Amount */}
                <div className="mb-6">
                  <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Investment Required</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white font-bold text-xl">
                          ${post.investmentAmount?.toLocaleString() || 'TBD'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2.5 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-all duration-200 text-sm font-medium border border-slate-600/50 flex items-center justify-center group">
                    <svg className="w-4 h-4 mr-1.5 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    One Pager
                  </button>
                  
                  <button className="flex-1 px-3 py-2.5 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-all duration-200 text-sm font-medium border border-slate-600/50 flex items-center justify-center group">
                    <svg className="w-4 h-4 mr-1.5 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 3v1h6V3H9z" />
                    </svg>
                    Pitch Deck
                  </button>
                  
                  <button className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-green-500/25 flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Invest
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {filteredPosts.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-6 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-6 py-3 shadow-2xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{filteredPosts.length}</div>
                <div className="text-xs text-slate-400">Opportunities</div>
              </div>
              <div className="w-px h-8 bg-slate-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{sectors.length}</div>
                <div className="text-xs text-slate-400">Sectors</div>
              </div>
              <div className="w-px h-8 bg-slate-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  ${filteredPosts.reduce((sum, post) => sum + (post.investmentAmount || 0), 0).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">Total Investment</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Posts