import React from "react"

const StripeLogo: React.FC<React.SVGAttributes<SVGElement>> = ({}) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" fill="white" />
      <rect x="4" y="4" width="32" height="32" rx="4" fill="#6772E5" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18.7941 16.555C18.7941 15.8272 19.3997 15.5457 20.3783 15.5457C21.9978 15.5806 23.587 15.9919 25.0203 16.7468V12.3534C23.5424 11.7726 21.9661 11.4831 20.3783 11.5008C16.6064 11.5008 14.0767 13.4765 14.0767 16.7755C14.0767 21.937 21.1645 21.0987 21.1645 23.3236C21.1645 24.1938 20.4208 24.4636 19.3742 24.4636C17.831 24.4636 15.8377 23.8251 14.2743 22.9751V27.4259C15.884 28.1262 17.6193 28.4917 19.3748 28.5C23.2512 28.5 25.9234 26.5849 25.9234 23.2285C25.9234 17.6579 18.7941 18.6529 18.7941 16.5561V16.555Z"
        fill="white"
      />
      <rect x="0.5" y="0.5" width="39" height="39" rx="7.5" stroke="#E6E8EB" />
    </svg>
  )
}

export default StripeLogo
