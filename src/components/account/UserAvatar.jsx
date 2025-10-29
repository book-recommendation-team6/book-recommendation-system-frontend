import React, { useState } from "react"

const UserAvatar = React.memo(({ src, alt, size = "md", className = "" }) => {
  const [hasError, setHasError] = useState(false)
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }
  const shouldDisplayImage = src && !hasError
  const fallbackInitial = alt?.trim()?.charAt(0)?.toUpperCase() || "U"

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 font-semibold ${className}`}
    >
      {shouldDisplayImage ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{fallbackInitial}</span>
      )}
    </div>
  )
})

UserAvatar.displayName = "UserAvatar"
export default UserAvatar
