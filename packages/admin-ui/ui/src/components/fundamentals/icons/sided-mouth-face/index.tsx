import React from "react"
import IconProps from "../types/icon-type"

const SidedMouthFaceIcon: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 48 48"
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
        d="M24 33.6649C20.592 33.6809 17.128 31.7849 16 28.2969"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 18.4805C33.21 19.4505 32.13 20.0005 31 20.0005C29.87 20.0005 28.82 19.4505 28 18.4805"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 18.4805C19.21 19.4505 18.13 20.0005 17 20.0005C15.87 20.0005 14.82 19.4505 14 18.4805"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

    </svg>
  )
}

export default SidedMouthFaceIcon
