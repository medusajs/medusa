import React from "react"

import { IconProps } from "types/icon"

const Package: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M13.3634 8.02695L6.73047 4.21271"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.724 12.9577V6.98101C16.7237 6.71899 16.6546 6.46164 16.5234 6.23479C16.3923 6.00794 16.2038 5.81956 15.9769 5.68855L10.7473 2.70018C10.5201 2.56904 10.2625 2.5 10.0002 2.5C9.7379 2.5 9.48024 2.56904 9.25309 2.70018L4.02346 5.68855C3.79654 5.81956 3.60806 6.00794 3.47693 6.23479C3.3458 6.46164 3.27664 6.71899 3.27637 6.98101V12.9577C3.27664 13.2198 3.3458 13.4771 3.47693 13.704C3.60806 13.9308 3.79654 14.1192 4.02346 14.2502L9.25309 17.2386C9.48024 17.3697 9.7379 17.4388 10.0002 17.4388C10.2625 17.4388 10.5201 17.3697 10.7473 17.2386L15.9769 14.2502C16.2038 14.1192 16.3923 13.9308 16.5234 13.704C16.6546 13.4771 16.7237 13.2198 16.724 12.9577Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.47852 6.20404L10.0006 9.97685L16.5227 6.20404"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Package
