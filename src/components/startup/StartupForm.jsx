import { useState } from 'react'
import { SECTORS } from '../../utils/constants'
import { api } from '../../services/api'

const StartupForm = ({ onSubmit, initialData = {}, isEdit = false }) => {
  const [formData, setFormData] = useState({
    companyName: initialData.companyName || '',
    establishmentDate: initialData.establishmentDate ? 
      new Date(initialData.establishmentDate).toISOString().split('T')[0] : '',
    sector: initialData.sector || '',
    teamSize: initialData.teamSize || '',
    aboutCompany: initialData.aboutCompany || '',
    website: initialData.website || '',
    androidApp: initialData.androidApp || '',
    iosApp: initialData.iosApp || '',
    // Handle social links - check if they come from nested structure or flat
    linkedIn: initialData.socialLinks?.linkedin || initialData.linkedIn || '',
    facebook: initialData.socialLinks?.facebook || initialData.facebook || '',
    instagram: initialData.socialLinks?.instagram || initialData.instagram || '',
    twitter: initialData.socialLinks?.twitter || initialData.twitter || ''
  })
  
  const [founders, setFounders] = useState(
    initialData.founders || [{ name: '', email: '', contactNo: '', linkedin: '', designation: '', sharePercentage: '' }]
  )
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? (value ? parseInt(value) : '') : value
    })
  }

  const handleFounderChange = (index, field, value) => {
    const updatedFounders = founders.map((founder, i) => 
      i === index ? { ...founder, [field]: value } : founder
    )
    setFounders(updatedFounders)
  }

  const addFounder = () => {
    setFounders([...founders, { 
      name: '', 
      email: '', 
      contactNo: '', 
      linkedin: '', 
      designation: '', 
      sharePercentage: '' 
    }])
  }

  const removeFounder = (index) => {
    if (founders.length > 1) {
      const updatedFounders = founders.filter((_, i) => i !== index)
      setFounders(updatedFounders)
    }
  }

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setError('Company name is required')
      return false
    }
    if (!formData.sector) {
      setError('Sector is required')
      return false
    }

    // Validate founders
    for (let i = 0; i < founders.length; i++) {
      const founder = founders[i]
      if (founder.name && !founder.email) {
        setError(`Email is required for founder ${i + 1}`)
        return false
      }
      if (founder.sharePercentage && (founder.sharePercentage < 0 || founder.sharePercentage > 100)) {
        setError(`Share percentage for founder ${i + 1} must be between 0 and 100`)
        return false
      }
    }

    // Check if total share percentage exceeds 100%
    const totalShares = founders.reduce((sum, founder) => 
      sum + (parseFloat(founder.sharePercentage) || 0), 0
    )
    if (totalShares > 100) {
      setError('Total share percentage cannot exceed 100%')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        establishmentDate: formData.establishmentDate ? new Date(formData.establishmentDate) : null,
        teamSize: formData.teamSize ? parseInt(formData.teamSize) : null,
        founders: founders.filter(founder => founder.name.trim() !== '').map(founder => ({
          ...founder,
          sharePercentage: founder.sharePercentage ? parseFloat(founder.sharePercentage) : 0
        }))
      }

      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null) {
          delete submitData[key]
        }
      })

      const response = await api.updateProfile('startup', submitData)

      setSuccess(isEdit ? 'Profile updated successfully!' : 'Profile created successfully!')
      
      if (onSubmit) {
        onSubmit(response.data)
      }
    } catch (error) {
      console.error('Error saving startup profile:', error)
      setError(
        error.response?.data?.message || 
        'Failed to save profile. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Establishment Date
              </label>
              <input
                type="date"
                name="establishmentDate"
                value={formData.establishmentDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
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
                {SECTORS.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Size
              </label>
              <input
                type="number"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Company
            </label>
            <textarea
              name="aboutCompany"
              value={formData.aboutCompany}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Describe your company, mission, and what makes you unique..."
            />
          </div>
        </div>

        {/* Product Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Product Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://yourcompany.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Android App
              </label>
              <input
                type="text"
                name="androidApp"
                value={formData.androidApp}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Play Store URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                iOS App
              </label>
              <input
                type="text"
                name="iosApp"
                value={formData.iosApp}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="App Store URL"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Social Media</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="text"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://facebook.com/yourcompany"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://instagram.com/yourcompany"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://twitter.com/yourcompany"
              />
            </div>
          </div>
        </div>

        {/* Founders Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Founders & Shareholders</h2>
            <button
              type="button"
              onClick={addFounder}
              className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
            >
              Add Founder
            </button>
          </div>
          
          {founders.map((founder, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Founder {index + 1}</h3>
                {founders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFounder(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={founder.name}
                    onChange={(e) => handleFounderChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={founder.email}
                    onChange={(e) => handleFounderChange(index, 'email', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={founder.contactNo}
                    onChange={(e) => handleFounderChange(index, 'contactNo', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    value={founder.linkedin}
                    onChange={(e) => handleFounderChange(index, 'linkedin', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={founder.designation}
                    onChange={(e) => handleFounderChange(index, 'designation', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="CEO, CTO, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Share Percentage
                  </label>
                  <input
                    type="number"
                    value={founder.sharePercentage}
                    onChange={(e) => handleFounderChange(index, 'sharePercentage', e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form Submission */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEdit ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              isEdit ? 'Update Profile' : 'Create Profile'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StartupForm