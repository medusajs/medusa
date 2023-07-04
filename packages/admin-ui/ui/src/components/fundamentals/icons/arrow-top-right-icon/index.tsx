import React from "react"
import IconProps from "../types/icon-type"

const ArrowTopRightIcon: React.FC<IconProps> = ({
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
        d="M15.0129 4.98792L4.93799 15.0628M15.0129 4.98792L7.93994 4.93713M15.0129 4.98792L15.0636 12.0608"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowTopRightIcon
