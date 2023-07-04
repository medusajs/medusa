import React from "react"
import IconProps from "../types/icon-type"

const CornerDownRightIcon: React.FC<IconProps> = ({
  size = "16",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M10 6.66602L13.3333 9.99935L10 13.3327"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.66797 2.66602V7.33268C2.66797 8.03993 2.94892 8.7182 3.44902 9.2183C3.94911 9.7184 4.62739 9.99935 5.33464 9.99935H13.3346"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CornerDownRightIcon
