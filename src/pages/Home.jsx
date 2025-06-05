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
  const [animatedStats, setAnimatedStats] = useState({
    totalStartups: 0,
    totalInvestors: 0,
    totalConsultants: 0,
    totalFunding: 0
  })

  useEffect(() => {
    fetchHomeData()
  }, [])

  useEffect(() => {
    // Animate statistics
    const targetStats = { totalStartups: 500, totalInvestors: 200, totalConsultants: 150, totalFunding: 50000000 }
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setAnimatedStats({
        totalStartups: Math.floor(targetStats.totalStartups * progress),
        totalInvestors: Math.floor(targetStats.totalInvestors * progress),
        totalConsultants: Math.floor(targetStats.totalConsultants * progress),
        totalFunding: Math.floor(targetStats.totalFunding * progress)
      })
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const fetchHomeData = async () => {
    try {
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
      description: 'Post funding requirements and connect with verified investors',
      benefits: ['Create detailed funding posts', 'Connect with verified investors', 'Get expert consultation', 'Track investment interest'],
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
      benefits: ['Browse curated opportunities', 'View detailed business plans', 'Direct startup communication', 'Portfolio management tools'],
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
      benefits: ['Create seed funding posts', 'Mentor startups', 'Build your portfolio', 'Expand your network'],
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
      avatar: 'SC',
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-rose-500'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Angel Investor',
      content: 'I\'ve found some amazing investment opportunities through StartupVista. The quality of startups and deal flow is excellent.',
      avatar: 'MR',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-cyan-500'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Investment Consultant',
      content: 'As a consultant, this platform has expanded my network significantly. I\'ve helped numerous startups achieve their funding goals.',
      avatar: 'EW',
      gradientFrom: 'from-violet-500',
      gradientTo: 'to-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section - More Compact */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-700/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            {/* Animated Logo */}
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
              <h1 className="relative text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                StartupVista
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-pulse"></div>
            </div>
            
            <div className="mb-12 space-y-4">
              <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                The premier ecosystem connecting 
                <span className="inline-block mx-2 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30 animate-pulse">startups</span>
                <span className="inline-block mx-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30 animate-pulse delay-300">investors</span>
                <span className="inline-block mx-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30 animate-pulse delay-600">consultants</span>
              </p>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Where innovation meets investment, and dreams become unicorns
              </p>
            </div>

            {/* Interactive CTA Buttons */}
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  to="/register"
                  className="group relative px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-500 shadow-2xl hover:shadow-white/20 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative flex items-center justify-center">
                    Get Started Free
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/posts"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-500 shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative">Browse Opportunities</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link
                  to="/dashboard"
                  className="group relative px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-500 shadow-2xl hover:shadow-white/20 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <span className="relative flex items-center justify-center">
                    Go to Dashboard
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  to="/posts"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold transition-all duration-500 shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative">Browse Posts</span>
                </Link>
              </div>
            )}

            {/* Animated Stats Grid - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-orange-500/20">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors tabular-nums">
                  {animatedStats.totalStartups}+
                </div>
                <div className="text-slate-400 text-sm font-medium">Startups</div>
              </div>
              
              <div className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-green-500/20">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors tabular-nums">
                  {animatedStats.totalInvestors}+
                </div>
                <div className="text-slate-400 text-sm font-medium">Investors</div>
              </div>
              
              <div className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-purple-500/20">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors tabular-nums">
                  {animatedStats.totalConsultants}+
                </div>
                <div className="text-slate-400 text-sm font-medium">Consultants</div>
              </div>
              
              <div className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/30 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-blue-500/20">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors tabular-nums">
                  {formatCurrency(animatedStats.totalFunding)}
                </div>
                <div className="text-slate-400 text-sm font-medium">Funding</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - More Compact */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built for Every Stakeholder
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Whether you're seeking funding, looking for opportunities, or helping businesses grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-xl p-6 shadow-xl ${feature.hoverShadow} transition-all duration-500 hover:-translate-y-3 hover:scale-105 overflow-hidden`}>
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className={`relative w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="relative text-xl font-bold mb-4 text-center text-white group-hover:text-slate-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="relative text-slate-400 mb-6 text-center text-sm leading-relaxed">
                  {feature.description}
                </p>
                <ul className="relative space-y-2 mb-6">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-slate-300 text-sm">
                      <div className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  to={feature.ctaLink}
                  className={`relative w-full bg-gradient-to-r ${feature.gradient} text-white py-3 px-6 rounded-lg font-semibold text-center block hover:shadow-lg transition-all duration-500 hover:-translate-y-1 group-hover:scale-105 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative">{feature.ctaText}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Posts Section - More Compact */}
      {featuredPosts.length > 0 && (
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Featured Opportunities
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-slate-400">
                Discover the latest funding opportunities and investment posts
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map((post, index) => (
                <div key={index} className="group bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-xl p-6 shadow-xl hover:shadow-slate-500/20 transition-all duration-500 hover:-translate-y-3 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 ${post.type === 'funding' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'} rounded-full text-xs font-medium`}>
                      {post.type === 'funding' ? 'Funding' : 'Investment'}
                    </span>
                    <span className="text-slate-400 text-xs bg-slate-700/50 px-2 py-1 rounded-full border border-slate-600/50">{post.sector}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-slate-200 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-400 mb-4 text-sm leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-400">
                      {formatCurrency(post.amount)}
                    </span>
                    <Link
                      to={`/posts/${post._id}`}
                      className="text-blue-400 hover:text-blue-300 font-medium group/link flex items-center text-sm"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/posts"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-500 shadow-xl hover:shadow-blue-500/30 hover:-translate-y-2"
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

      {/* Testimonials Section - More Compact */}
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-400">
              Hear from successful entrepreneurs, investors, and consultants
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group bg-slate-800/40 backdrop-blur-xl border border-slate-700/40 rounded-xl p-6 shadow-xl hover:shadow-slate-500/20 transition-all duration-500 hover:-translate-y-3 hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${testimonial.gradientFrom} ${testimonial.gradientTo} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
                  </div>
                </div>
                <p className="text-slate-300 mb-6 italic text-sm leading-relaxed text-center">
                  "{testimonial.content}"
                </p>
                <div className="text-center border-t border-slate-700/50 pt-4">
                  <div className="font-bold text-white text-sm mb-1">{testimonial.name}</div>
                  <div className="text-slate-400 text-xs">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur-xl border border-slate-700/40 rounded-2xl p-12 shadow-2xl relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 animate-pulse"></div>
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Startup Journey?
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of successful entrepreneurs, investors, and consultants who trust StartupVista
              </p>
              
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/register"
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-500 shadow-xl hover:shadow-blue-500/30 hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    <span className="relative flex items-center justify-center">
                      Start Your Journey
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    to="/posts"
                    className="group px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-500 shadow-xl hover:shadow-white/20 hover:-translate-y-2"
                  >
                    Explore Opportunities
                  </Link>
                </div>
              ) : (
                <Link
                  to="/posts/create"
                  className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-500 shadow-xl hover:shadow-blue-500/30 hover:-translate-y-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative flex items-center">
                    Create Your First Post
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Infographic Section - Network Visualization */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How StartupVista Works
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-400">
              A seamless ecosystem for startup funding and growth
            </p>
          </div>

          {/* Network Visualization */}
          <div className="relative">
            <svg className="w-full h-96 overflow-visible" viewBox="0 0 800 400">
              {/* Connection lines with animation */}
              <defs>
                <linearGradient id="connectionGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="connectionGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="connectionGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              
              {/* Animated connection lines */}
              <line x1="150" y1="200" x2="400" y2="120" stroke="url(#connectionGradient1)" strokeWidth="2" className="animate-pulse">
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
              </line>
              <line x1="400" y1="120" x2="650" y2="200" stroke="url(#connectionGradient2)" strokeWidth="2" className="animate-pulse">
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="0.7s" />
              </line>
              <line x1="650" y1="200" x2="150" y2="200" stroke="url(#connectionGradient3)" strokeWidth="2" className="animate-pulse">
                <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" begin="1.3s" />
              </line>
              
              {/* Central hub */}
              <circle cx="400" cy="120" r="40" fill="url(#connectionGradient1)" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="2">
                <animate attributeName="r" values="35;45;35" dur="3s" repeatCount="indefinite" />
              </circle>
              
              {/* Node circles */}
              <circle cx="150" cy="200" r="30" fill="url(#connectionGradient1)" fillOpacity="0.3" stroke="#f97316" strokeWidth="2">
                <animate attributeName="r" values="25;35;25" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="650" cy="200" r="30" fill="url(#connectionGradient2)" fillOpacity="0.3" stroke="#10b981" strokeWidth="2">
                <animate attributeName="r" values="25;35;25" dur="2.5s" repeatCount="indefinite" begin="0.8s" />
              </circle>
            </svg>

            {/* Labels */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center">
                <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-lg px-4 py-2">
                  <div className="text-blue-400 font-semibold text-sm">StartupVista Hub</div>
                  <div className="text-slate-300 text-xs">Connecting Ecosystem</div>
                </div>
              </div>
              
              <div className="absolute top-32 left-12 text-center">
                <div className="bg-slate-800/80 backdrop-blur-xl border border-orange-500/30 rounded-lg px-4 py-2">
                  <div className="text-orange-400 font-semibold text-sm">Startups</div>
                  <div className="text-slate-300 text-xs">Seeking Funding</div>
                </div>
              </div>
              
              <div className="absolute top-32 right-12 text-center">
                <div className="bg-slate-800/80 backdrop-blur-xl border border-green-500/30 rounded-lg px-4 py-2">
                  <div className="text-green-400 font-semibold text-sm">Investors</div>
                  <div className="text-slate-300 text-xs">Providing Capital</div>
                </div>
              </div>
              
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                <div className="bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 rounded-lg px-4 py-2">
                  <div className="text-purple-400 font-semibold text-sm">Consultants</div>
                  <div className="text-slate-300 text-xs">Expert Guidance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Steps - Infographic Style */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple 3-Step Process
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Create Profile</h3>
              <p className="text-slate-400 leading-relaxed">
                Sign up and create your detailed profile as a startup, investor, or consultant
              </p>
              {/* Connecting arrow for desktop */}
              <div className="hidden md:block absolute top-10 -right-4 text-slate-600">
                <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group text-center relative">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse delay-300"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Connect & Browse</h3>
              <p className="text-slate-400 leading-relaxed">
                Browse opportunities, connect with verified users, and engage with relevant posts
              </p>
              {/* Connecting arrow for desktop */}
              <div className="hidden md:block absolute top-10 -right-4 text-slate-600">
                <svg className="w-8 h-8 animate-pulse delay-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Collaborate & Grow</h3>
              <p className="text-slate-400 leading-relaxed">
                Secure funding, make investments, or provide consulting services to grow together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home