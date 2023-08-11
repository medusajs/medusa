import React from "react"
import IconProps from "../types/icon-type"

const PointerIcon: React.FC<IconProps> = ({
  size = "16",
  color = "#9CA3AF",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.84375 2.84332L7.14047 13.1567L8.66589 8.66546L13.1571 7.14004L2.84375 2.84332Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.92188 8.92072L12.5683 12.5672"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PointerIcon
