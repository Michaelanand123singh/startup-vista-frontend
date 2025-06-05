import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { SECTORS, INVESTMENT_TYPES } from '../../utils/constants'
import PostCard from './PostCard'
import InvestmentQuestions from '../investor/InvestmentQuestions'

const PostList = () => {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [showInvestmentModal, setShowInvestmentModal] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    sector: '',
    investmentType: '',
    minAmount: '',
    maxAmount: '',
    search: ''
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [posts, filters])

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts')
      setPosts(response.data)
    } catch (err) {
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...posts]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(post => 
        post.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.sector.toLowerCase().includes(filters.search.toLowerCase()) ||
        (post.description && post.description.toLowerCase().includes(filters.search.toLowerCase()))
      )
    }

    // Sector filter
    if (filters.sector) {
      filtered = filtered.filter(post => post.sector === filters.sector)
    }

    // Investment type filter
    if (filters.investmentType) {
      filtered = filtered.filter(post => post.investmentType === filters.investmentType)
    }

    // Amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter(post => post.investmentAmount >= parseInt(filters.minAmount))
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(post => post.investmentAmount <= parseInt(filters.maxAmount))
    }

    setFilteredPosts(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      sector: '',
      investmentType: '',
      minAmount: '',
      maxAmount: '',
      search: ''
    })
  }

  const handleInvest = (post) => {
    setSelectedPost(post)
    setShowInvestmentModal(true)
  }

  const handleInvestmentSubmit = async (responses) => {
    try {
      await api.post(`/posts/${selectedPost._id}/invest`, {
        responses
      })
      
      // Refresh posts to update interest count
      fetchPosts()
      
      setShowInvestmentModal(false)
      setSelectedPost(null)
      
      // Show success message
      alert('Investment interest submitted successfully!')
    } catch (err) {
      alert('Failed to submit investment interest')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Investment Opportunities
        </h1>
        <p className="text-gray-600">
          Discover promising startups looking for funding
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search companies, sectors..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sector
            </label>
            <select
              value={filters.sector}
              onChange={(e) => handleFilterChange('sector', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All Sectors</option>
              {SECTORS.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.investmentType}
              onChange={(e) => handleFilterChange('investmentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value={INVESTMENT_TYPES.EQUITY}>Equity</option>
              <option value={INVESTMENT_TYPES.DEBT}>Debt</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Amount (₹)
            </label>
            <input
              type="number"
              placeholder="Min"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Amount (₹)
            </label>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={clearFilters}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Clear Filters
          </button>
          <div className="text-sm text-gray-600">
            Showing {filteredPosts.length} of {posts.length} opportunities
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500">
            <option value="newest">Newest First</option>
            <option value="amount-high">Highest Amount</option>
            <option value="amount-low">Lowest Amount</option>
            <option value="interest">Most Interest</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 bg-blue-50 border-blue-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No posts found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredPosts.map(post => (
            <PostCard 
              key={post._id} 
              post={post} 
              onInvest={handleInvest}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredPosts.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Load More Opportunities
          </button>
        </div>
      )}

      {/* Investment Questions Modal */}
      {showInvestmentModal && selectedPost && (
        <InvestmentQuestions
          post={selectedPost}
          onSubmit={handleInvestmentSubmit}
          onClose={() => {
            setShowInvestmentModal(false)
            setSelectedPost(null)
          }}
        />
      )}
    </div>
  )
}

export default PostList