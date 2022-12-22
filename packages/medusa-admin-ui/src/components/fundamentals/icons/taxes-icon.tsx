import React from "react"
import IconProps from "./types/icon-type"

const TaxesIcon: React.FC<IconProps> = ({
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
        d="M21 9H3V7L12 3L21 7V9Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10 20.75C10.4142 20.75 10.75 20.4142 10.75 20C10.75 19.5858 10.4142 19.25 10 19.25V20.75ZM3 20L2.28 19.79C2.2139 20.0166 2.25836 20.2611 2.4 20.45C2.54164 20.6389 2.76393 20.75 3 20.75V20ZM3.875 17V16.25C3.54167 16.25 3.24833 16.47 3.155 16.79L3.875 17ZM10 17.75C10.4142 17.75 10.75 17.4142 10.75 17C10.75 16.5858 10.4142 16.25 10 16.25V17.75ZM10 19.25H3V20.75H10V19.25ZM3.72 20.21L4.595 17.21L3.155 16.79L2.28 19.79L3.72 20.21ZM3.875 17.75H10V16.25H3.875V17.75Z"
        fill={color}
      />
      <path d="M5 9V17M9 17V9" stroke={color} strokeWidth="1.5" />
      <path
        d="M20.5625 13.4375L14.4375 19.5625"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 14.5C15.1642 14.5 15.5 14.1642 15.5 13.75C15.5 13.3358 15.1642 13 14.75 13C14.3358 13 14 13.3358 14 13.75C14 14.1642 14.3358 14.5 14.75 14.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.25 20C20.6642 20 21 19.6642 21 19.25C21 18.8358 20.6642 18.5 20.25 18.5C19.8358 18.5 19.5 18.8358 19.5 19.25C19.5 19.6642 19.8358 20 20.25 20Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default TaxesIcon
