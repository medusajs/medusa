import React from "react"
import IconProps from "../types/icon-type"

const PackageIcon: React.FC<IconProps> = ({
  size = "16",
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
        d="M13.3634 8.02713L6.73047 4.21289"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.723 12.9577V6.98101C16.7228 6.71899 16.6536 6.46164 16.5225 6.23479C16.3913 6.00794 16.2029 5.81956 15.9759 5.68855L10.7463 2.70018C10.5192 2.56904 10.2615 2.5 9.99921 2.5C9.73692 2.5 9.47926 2.56904 9.25212 2.70018L4.02248 5.68855C3.79556 5.81956 3.60708 6.00794 3.47596 6.23479C3.34483 6.46164 3.27566 6.71899 3.27539 6.98101V12.9577C3.27566 13.2198 3.34483 13.4771 3.47596 13.704C3.60708 13.9308 3.79556 14.1192 4.02248 14.2502L9.25212 17.2386C9.47926 17.3697 9.73692 17.4388 9.99921 17.4388C10.2615 17.4388 10.5192 17.3697 10.7463 17.2386L15.9759 14.2502C16.2029 14.1192 16.3913 13.9308 16.5225 13.704C16.6536 13.4771 16.7228 13.2198 16.723 12.9577Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.47852 6.2041L10.0006 9.97691L16.5227 6.2041"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 17.5004V9.96973"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PackageIcon
