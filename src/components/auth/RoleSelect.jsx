import { useState } from 'react'
import { USER_ROLES } from '../../utils/constants'

const RoleSelect = ({ selectedRole, onRoleSelect }) => {
  const [hoveredRole, setHoveredRole] = useState(null)

  const roleInfo = {
    [USER_ROLES.STARTUP]: {
      title: 'Startup',
      description: 'Looking for funding and growth opportunities',
      features: [
        'Create funding posts',
        'Connect with investors',
        'Work with consultants',
        'Showcase your business'
      ],
      icon: '🚀'
    },
    [USER_ROLES.INVESTOR]: {
      title: 'Investor',
      description: 'Invest in promising startups',
      features: [
        'Browse startup opportunities',
        'Review pitch decks',
        'Express investment interest',
        'Build your portfolio'
      ],
      icon: '💰'
    },
    [USER_ROLES.CONSULTANT]: {
      title: 'Consultant',
      description: 'Help startups grow and connect with investors',
      features: [
        'Guide startup founders',
        'Create seed funding posts',
        'Verify startup profiles',
        'Facilitate connections'
      ],
      icon: '📊'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Role
        </h2>
        <p className="text-gray-600 text-lg">
          Select how you'd like to participate in the StartupVista ecosystem
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(roleInfo).map(([role, info]) => (
          <div
            key={role}
            onClick={() => onRoleSelect(role)}
            onMouseEnter={() => setHoveredRole(role)}
            onMouseLeave={() => setHoveredRole(null)}
            className={`
              relative cursor-pointer rounded-xl p-6 border-2 transition-all duration-300
              ${selectedRole === role 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }
              ${hoveredRole === role ? 'transform scale-105' : ''}
            `}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">{info.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {info.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {info.description}
              </p>
              
              <div className="space-y-2">
                {info.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <svg 
                      className="w-4 h-4 text-green-500 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {selectedRole === role && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-4 h-4 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedRole && (
        <div className="mt-8 text-center">
          <p className="text-green-600 font-medium">
            ✓ Great choice! You've selected {roleInfo[selectedRole].title}
          </p>
        </div>
      )}
    </div>
  )
}

export default RoleSelect