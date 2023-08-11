import React from "react"
import IconProps from "../types/icon-type"

const SignOutIcon: React.FC<IconProps> = ({
  size = "16",
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
        d="M8 17H4.66667C4.22464 17 3.80072 16.8361 3.48816 16.5444C3.17559 16.2527 3 15.857 3 15.4444V4.55556C3 4.143 3.17559 3.74733 3.48816 3.45561C3.80072 3.16389 4.22464 3 4.66667 3H8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 14L17 10L13 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 10L8 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SignOutIcon
