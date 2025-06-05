import { useState } from 'react'
import { SECTORS } from '../../utils/constants'
import { api } from '../../services/api'

const InvestorForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    contactNo: initialData.contactNo || '',
    linkedIn: initialData.linkedIn || '',
    ticketSize: initialData.ticketSize || '',
    preferredSectors: initialData.preferredSectors || []
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSectorChange = (sector) => {
    const updatedSectors = formData.preferredSectors.includes(sector)
      ? formData.preferredSectors.filter(s => s !== sector)
      : [...formData.preferredSectors, sector]
    
    setFormData({
      ...formData,
      preferredSectors: updatedSectors
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await api.post('/investors/profile', formData)
      if (onSubmit) onSubmit(formData)
    } catch (error) {
      console.error('Error saving investor profile:', error)
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
            Ticket Size ($)
          </label>
          <input
            type="number"
            name="ticketSize"
            value={formData.ticketSize}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Sectors
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SECTORS.map(sector => (
            <label key={sector} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.preferredSectors.includes(sector)}
                onChange={() => handleSectorChange(sector)}
                className="mr-2"
              />
              <span className="text-sm">{sector}</span>
            </label>
          ))}
        </div>
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

export default InvestorForm