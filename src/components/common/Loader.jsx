const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      {/* Main loader container */}
      <div className="relative">
        {/* Outer ring */}
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 p-1">
          <div className="bg-white dark:bg-slate-900 rounded-full h-full w-full"></div>
        </div>
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default Loader