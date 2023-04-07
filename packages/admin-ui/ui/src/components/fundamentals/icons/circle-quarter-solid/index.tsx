import IconProps from "../types/icon-type"
import React from "react"

const CircleQuarterSolid: React.FC<IconProps> = ({
  size = "24",
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
      <circle cx="10" cy="10" r="7.25" stroke={color} strokeWidth="1.5" />
      <path d="M15 10C15 7.23858 12.7614 5 10 5V10H15Z" fill={color} />
    </svg>
  )
}

export default CircleQuarterSolid
