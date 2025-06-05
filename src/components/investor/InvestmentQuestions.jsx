import { useState } from 'react'
import { api } from '../../services/api'

const InvestmentQuestions = ({ postId, onClose, onSuccess }) => {
  const [answers, setAnswers] = useState({
    investmentAmount: '',
    timeframe: '',
    experience: '',
    additionalComments: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setAnswers({
      ...answers,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post(`/posts/${postId}/invest`, answers)
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit interest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Investment Interest</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How much are you looking to invest? *
          </label>
          <input
            type="number"
            name="investmentAmount"
            value={answers.investmentAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is your investment timeframe? *
          </label>
          <select
            name="timeframe"
            value={answers.timeframe}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select timeframe</option>
            <option value="immediate">Immediate (within 1 month)</option>
            <option value="short">Short term (1-3 months)</option>
            <option value="medium">Medium term (3-6 months)</option>
            <option value="long">Long term (6+ months)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your investment experience *
          </label>
          <select
            name="experience"
            value={answers.experience}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select experience level</option>
            <option value="beginner">Beginner (0-2 investments)</option>
            <option value="intermediate">Intermediate (3-10 investments)</option>
            <option value="experienced">Experienced (10+ investments)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments
          </label>
          <textarea
            name="additionalComments"
            value={answers.additionalComments}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Any specific questions or requirements..."
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Interest'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default InvestmentQuestions