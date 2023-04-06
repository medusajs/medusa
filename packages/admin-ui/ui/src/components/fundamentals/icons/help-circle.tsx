import React from "react"
import IconProps from "./types/icon-type"

const HelpCircleIcon: React.FC<IconProps> = ({
  size = "24px",
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
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.08594 9.03573C9.32104 8.36739 9.78509 7.80383 10.3959 7.44486C11.0067 7.08588 11.7248 6.95466 12.4231 7.07444C13.1214 7.19421 13.7548 7.55725 14.211 8.09925C14.6673 8.64126 14.917 9.32725 14.9159 10.0357C14.9159 12.0357 11.9159 13.0357 11.9159 13.0357"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9961 16.4316H12.0061"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default HelpCircleIcon
