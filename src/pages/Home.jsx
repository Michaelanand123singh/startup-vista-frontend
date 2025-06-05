import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

const Home = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalStartups: 0,
    totalInvestors: 0,
    totalConsultants: 0,
    totalFunding: 0
  })
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      const [statsResponse, postsResponse] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/posts/featured')
      ])
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
      
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setFeaturedPosts(postsData.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'For Startups',
      description: 'Post your funding requirements and connect with verified investors and consultants',
      benefits: [
        'Create detailed funding posts',
        'Connect with verified investors',
        'Get expert consultation',
        'Track investment interest'
      ],
      ctaText: user?.role === 'startup' ? 'Create Post' : 'Join as Startup',
      ctaLink: user?.role === 'startup' ? '/posts/create' : '/register?role=startup',
      gradient: 'from-orange-500 to-red-500',
      hoverShadow: 'hover:shadow-orange-500/20'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'For Investors',
      description: 'Discover investment opportunities and connect with promising startups',
      benefits: [
        'Browse curated opportunities',
        'View detailed business plans',
        'Direct startup communication',
        'Portfolio management tools'
      ],
      ctaText: user?.role === 'investor' ? 'Browse Opportunities' : 'Join as Investor',
      ctaLink: user?.role === 'investor' ? '/posts' : '/register?role=investor',
      gradient: 'from-green-500 to-emerald-500',
      hoverShadow: 'hover:shadow-green-500/20'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'For Consultants',
      description: 'Help startups grow and post seed funding opportunities',
      benefits: [
        'Create seed funding posts',
        'Mentor startups',
        'Build your portfolio',
        'Expand your network'
      ],
      ctaText: user?.role === 'consultant' ? 'Create Seed Post' : 'Join as Consultant',
      ctaLink: user?.role === 'consultant' ? '/posts/create-seed' : '/register?role=consultant',
      gradient: 'from-purple-500 to-indigo-500',
      hoverShadow: 'hover:shadow-purple-500/20'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Founder, TechStart',
      content: 'StartupVista helped us secure our Series A funding. The platform connected us with the right investors who understood our vision.',
      avatar: (
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">SC</span>
        </div>
      )
    },
    {
      name: 'Michael Rodriguez',
      role: 'Angel Investor',
      content: 'I\'ve found some amazing investment opportunities through StartupVista. The quality of startups and deal flow is excellent.',
      avatar: (
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">MR</span>
        </div>
      )
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Investment Consultant',
      content: 'As a consultant, this platform has expanded my network significantly. I\'ve helped numerous startups achieve their funding goals.',
      avatar: (
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">EW</span>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-700/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-32">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                StartupVista
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8"></div>
            </div>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              The premier platform connecting <span className="text-orange-400 font-semibold">startups</span>, 
              <span className="text-green-400 font-semibold"> investors</span>, and 
              <span className="text-purple-400 font-semibold"> consultants</span> for funding and growth collaboration
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/register"
                  className="group px-10 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-white/10 hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center">
                    Get Started Free
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/posts"
                  className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1"
                >
                  Browse Opportunities
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/dashboard"
                  className="group px-10 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-white/10 hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center">
                    Go to Dashboard
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/posts"
                  className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1"
                >
                  Browse Posts
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                {loading ? '...' : stats.totalStartups || '500+'}
              </div>
              <div className="text-slate-400 font-medium">Active Startups</div>
            </div>
            
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                {loading ? '...' : stats.totalInvestors || '200+'}
              </div>
              <div className="text-slate-400 font-medium">Verified Investors</div>
            </div>
            
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {loading ? '...' : stats.totalConsultants || '150+'}
              </div>
              <div className="text-slate-400 font-medium">Expert Consultants</div>
            </div>
            
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {loading ? '...' : formatCurrency(stats.totalFunding || 50000000)}
              </div>
              <div className="text-slate-400 font-medium">Total Funding</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              Built for Every Stakeholder
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Whether you're a startup seeking funding, an investor looking for opportunities, 
              or a consultant helping businesses grow, StartupVista has you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl ${feature.hoverShadow} transition-all duration-300 hover:-translate-y-2`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-white group-hover:text-slate-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 mb-8 text-center leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-slate-300">
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  to={feature.ctaLink}
                  className={`w-full bg-gradient-to-r ${feature.gradient} text-white py-4 px-6 rounded-xl font-semibold text-center block hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                >
                  {feature.ctaText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <div className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold text-white mb-6">
                Featured Opportunities
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8"></div>
              <p className="text-xl text-slate-400">
                Discover the latest funding opportunities and investment posts
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <div key={index} className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-slate-500/10 transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-4 py-2 ${post.type === 'funding' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'} rounded-full text-sm font-medium`}>
                      {post.type === 'funding' ? 'Funding' : 'Investment'}
                    </span>
                    <span className="text-slate-400 text-sm bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600/50">{post.sector}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-slate-200 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 mb-6 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-400">
                      {formatCurrency(post.amount)}
                    </span>
                    <Link
                      to={`/posts/${post._id}`}
                      className="text-blue-400 hover:text-blue-300 font-medium group flex items-center"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link
                to="/posts"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1"
              >
                View All Opportunities
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-white mb-6">
              What Our Users Say
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-slate-400">
              Hear from successful entrepreneurs, investors, and consultants
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-slate-500/10 transition-all duration-300 hover:-translate-y-2">
                <div className="flex justify-center mb-6">
                  {testimonial.avatar}
                </div>
                <p className="text-slate-300 mb-8 italic leading-relaxed text-center">
                  "{testimonial.content}"
                </p>
                <div className="text-center border-t border-slate-700/50 pt-6">
                  <div className="font-bold text-white mb-1">{testimonial.name}</div>
                  <div className="text-slate-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home