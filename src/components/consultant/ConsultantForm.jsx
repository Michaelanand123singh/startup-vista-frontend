import { useState } from 'react'
import { api } from '../../services/api'

const ConsultantForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    contactNo: initialData.contactNo || '',
    linkedIn: initialData.linkedIn || '',
    totalInvestment: initialData.totalInvestment || '',
    totalStartupsFunded: initialData.totalStartupsFunded || '',
    portfolio: initialData.portfolio || []
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const addPortfolioItem = () => {
    setFormData({
      ...formData,
      portfolio: [...formData.portfolio, { companyName: '', investmentAmount: '' }]
    })
  }

  const updatePortfolioItem = (index, field, value) => {
    const updatedPortfolio = formData.portfolio.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    )
    setFormData({
      ...formData,
      portfolio: updatedPortfolio
    })
  }

  const removePortfolioItem = (index) => {
    const updatedPortfolio = formData.portfolio.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      portfolio: updatedPortfolio
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await api.post('/consultants/profile', formData)
      if (onSubmit) onSubmit(formData)
    } catch (error) {
      console.error('Error saving consultant profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Investment ($)
          </label>
          <input
            type="number"
            name="totalInvestment"
            value={formData.totalInvestment}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Startups Funded
          </label>
          <input
            type="number"
            name="totalStartupsFunded"
            value={formData.totalStartupsFunded}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Portfolio
          </label>
          <button
            type="button"
            onClick={addPortfolioItem}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
          >
            Add Portfolio Item
          </button>
        </div>
        
        {formData.portfolio.map((item, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Company Name"
              value={item.companyName}
              onChange={(e) => updatePortfolioItem(index, 'companyName', e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Investment Amount"
              value={item.investmentAmount}
              onChange={(e) => updatePortfolioItem(index, 'investmentAmount', e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => removePortfolioItem(index)}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}

export default ConsultantForm