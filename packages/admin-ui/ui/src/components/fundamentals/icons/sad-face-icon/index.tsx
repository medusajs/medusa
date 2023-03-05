import React from "react"
import IconProps from "../types/icon-type"

const SadFaceIcon: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M36.7279 11.2721C43.7573 18.3015 43.7573 29.6985 36.7279 36.7279C29.6984 43.7573 18.3015 43.7573 11.2721 36.7279C4.24264 29.6984 4.24264 18.3015 11.2721 11.2721C18.3015 4.24264 29.6985 4.24264 36.7279 11.2721"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 31.999C17 31.999 19.626 29.375 24 29.375C28.376 29.375 31 31.999 31 31.999"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 20C33.21 19.03 32.13 18.48 31 18.48C29.87 18.48 28.82 19.03 28 20"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 20C19.21 19.03 18.13 18.48 17 18.48C15.87 18.48 14.82 19.03 14 20"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

  )
}

export default SadFaceIcon
