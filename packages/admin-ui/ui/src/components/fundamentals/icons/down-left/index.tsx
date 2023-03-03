import React from "react"
import IconProps from "../types/icon-type"

const DownLeftIcon: React.FC<IconProps> = ({
  size = "16",
  color = "#9CA3AF",
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
        d="M6.00033 6.66663L2.66699 9.99996L6.00033 13.3333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3337 2.66663V7.33329C13.3337 8.04054 13.0527 8.71881 12.5526 9.21891C12.0525 9.71901 11.3742 9.99996 10.667 9.99996H2.66699"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default DownLeftIcon
