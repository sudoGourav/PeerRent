import { useState } from "react";

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackIcon = "📦",
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-6xl text-gray-400 ${className}`}
      >
        {fallbackIcon}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}