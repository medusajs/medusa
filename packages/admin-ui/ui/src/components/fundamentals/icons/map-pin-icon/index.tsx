import React from "react"
import IconProps from "../types/icon-type"

const MapPinIcon: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M19 10.3636C19 16.0909 12 21 12 21C12 21 5 16.0909 5 10.3636C5 8.41068 5.7375 6.53771 7.05025 5.15676C8.36301 3.77581 10.1435 3 12 3C13.8565 3 15.637 3.77581 16.9497 5.15676C18.2625 6.53771 19 8.41068 19 10.3636Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MapPinIcon
