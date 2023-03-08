import React from "react"
import IconProps from "../types/icon-type"

const TagRedDotIcon: React.FC<IconProps> = ({ size = "24", ...attributes }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <circle cx="16" cy="16" r="6" fill="#FFE5E5" />
      <circle cx="16" cy="16" r="3" fill="#E5484D" />
    </svg>
  )
}

export default TagRedDotIcon
