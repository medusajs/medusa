import React from "react"
import IconProps from "../types/icon-type"

const CheckCircleIcon: React.FC<IconProps> = ({
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
      <path
        d="M10 17.5C14.1422 17.5 17.5 14.1422 17.5 10C17.5 5.85775 14.1422 2.5 10 2.5C5.85775 2.5 2.5 5.85775 2.5 10C2.5 14.1422 5.85775 17.5 10 17.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 9.99998L9.16667 11.6666L12.5 8.33331"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CheckCircleIcon
