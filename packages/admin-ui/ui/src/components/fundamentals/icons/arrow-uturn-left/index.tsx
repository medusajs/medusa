import React from "react"
import IconProps from "../types/icon-type"

const ArrowUTurnLeft: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      {...attributes}
    >
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7.667 12.333 3.001 7.667m0 0 4.666-4.666M3.001 7.667h9.332a4.666 4.666 0 1 1 0 9.332H10"
      />
    </svg>
  )
}

export default ArrowUTurnLeft
