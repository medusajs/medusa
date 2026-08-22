import React from "react"

export default function CashfreeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="120" height="120" rx="24" fill="#002970" />
      {/* Cashfree stylised brand geometric 'C' and 'F' glyph */}
      <path
        d="M32 36H76C82.6274 36 88 41.3726 88 48C88 54.6274 82.6274 60 76 60H52V84H32V36Z"
        fill="#00BFA5"
      />
      <circle cx="72" cy="74" r="12" fill="#F39C12" />
    </svg>
  )
}
