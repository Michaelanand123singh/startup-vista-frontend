import { useState, useEffect } from 'react'
import { api } from '../../services/api'

const CreateSeedPost = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    fundingAmount: initialData.fundingAmount || '',
    equityOffered: initialData.equityOffered || '',
    sector: initialData.sector || '',
    fundingStage: initialData.fundingStage || 'seed',
    minimumInvestment: initialData.minimumInvestment || '',
    maximumInvestment: initialData.maximumInvestment || '',
    location: initialData.location || '',
    businessModel: initialData.businessModel || '',
    revenueModel: initialData.revenueModel || '',
    targetMarket: initialData.targetMarket || '',
    competitiveAdvantage: initialData.competitiveAdvantage || '',
    useOfFunds: initialData.useOfFunds || '',
    timeline: initialData.timeline || '',
    documents: initialData.documents || []
  })
  
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(false)
  const [documentFiles, setDocumentFiles] = useState([])

  const fundingStages = [
    { value: 'seed', label: 'Seed Funding' },
    { value: 'pre-series-a', label: 'Pre-Series A' },
    { value: 'series-a', label: 'Series A' },
    { value: 'series-b', label: 'Series B' },
    { value: 'series-c', label: 'Series C' },
    { value: 'bridge', label: 'Bridge Funding' }
  ]

  useEffect(() => {
    fetchSectors()
  }, [])

  const fetchSectors = async () => {
    try {
      const response = await api.get('/sectors')
      setSectors(response.data)
    } catch (error) {
      console.error('Error fetching sectors:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setDocumentFiles(files)
  }

  const uploadDocuments = async () => {
    if (documentFiles.length === 0) return []

    const uploadedDocs = []
    for (const file of documentFiles) {
      const formData = new FormData()
      formData.append('document', file)
      
      try {
        const response = await api.post('/uploads/document', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        uploadedDocs.push({
          name: file.name,
          url: response.data.url,
          type: file.type
        })
      } catch (error) {
        console.error('Error uploading document:', error)
      }
    }
    return uploadedDocs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upload documents first
      const uploadedDocuments = await uploadDocuments()
      
      const postData = {
        ...formData,
        documents: [...formData.documents, ...uploadedDocuments],
        type: 'seed_funding'
      }

      const response = await api.post('/posts', postData)
      
      if (onSubmit) {
        onSubmit(response.data)
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        fundingAmount: '',
        equityOffered: '',
        sector: '',
        fundingStage: 'seed',
        minimumInvestment: '',
        maximumInvestment: '',
        location: '',
        businessModel: '',
        revenueModel: '',
        targetMarket: '',
        competitiveAdvantage: '',
        useOfFunds: '',
        timeline: '',
        documents: []
      })
      setDocumentFiles([])
      
    } catch (error) {
      console.error('Error creating seed post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Seed Funding Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., Seeking $50K Seed Funding for AI-Powered EdTech Platform"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Amount ($) *
              </label>
              <input
                type="number"
                name="fundingAmount"
                value={formData.fundingAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="50000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equity Offered (%) *
              </label>
              <input
                type="number"
                name="equityOffered"
                value={formData.equityOffered}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="10"
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sector *
              </label>
              <select
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Sector</option>
                {sectors.map(sector => (
                  <option key={sector._id} value={sector._id}>
                    {sector.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Stage
              </label>
              <select
                name="fundingStage"
                value={formData.fundingStage}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                {fundingStages.map(stage => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Investment ($)
              </label>
              <input
                type="number"
                name="minimumInvestment"
                value={formData.minimumInvestment}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Investment ($)
              </label>
              <input
                type="number"
                name="maximumInvestment"
                value={formData.maximumInvestment}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="25000"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Describe your business, the problem you're solving, and your solution..."
              required
            />
          </div>

          {/* Business Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Model
              </label>
              <textarea
                name="businessModel"
                value={formData.businessModel}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="How does your business operate and create value?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revenue Model
              </label>
              <textarea
                name="revenueModel"
                value={formData.revenueModel}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="How do you generate revenue?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Market
              </label>
              <textarea
                name="targetMarket"
                value={formData.targetMarket}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Who are your target customers?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Competitive Advantage
              </label>
              <textarea
                name="competitiveAdvantage"
                value={formData.competitiveAdvantage}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="What makes you different from competitors?"
              />
            </div>
          </div>

          {/* Use of Funds & Timeline */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use of Funds
              </label>
              <textarea
                name="useOfFunds"
                value={formData.useOfFunds}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="How will you use the investment funds?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline & Milestones
              </label>
              <textarea
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Key milestones and timeline for your business..."
              />
            </div>
          </div>

          {/* Documents Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload business plan, financial projections, pitch deck, etc. (PDF, DOC, PPT, XLS files only)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating Post...' : 'Create Seed Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSeedPost