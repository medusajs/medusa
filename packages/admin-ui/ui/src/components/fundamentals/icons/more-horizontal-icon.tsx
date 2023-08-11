import React from "react"
import IconProps from "./types/icon-type"

const MoreHorizontalIcon: React.FC<IconProps> = ({
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
        d="M10 10.75C10.4142 10.75 10.75 10.4142 10.75 10C10.75 9.58579 10.4142 9.25 10 9.25C9.58579 9.25 9.25 9.58579 9.25 10C9.25 10.4142 9.58579 10.75 10 10.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.833 10.75C16.2472 10.75 16.583 10.4142 16.583 10C16.583 9.58579 16.2472 9.25 15.833 9.25C15.4188 9.25 15.083 9.58579 15.083 10C15.083 10.4142 15.4188 10.75 15.833 10.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16699 10.75C4.58121 10.75 4.91699 10.4142 4.91699 10C4.91699 9.58579 4.58121 9.25 4.16699 9.25C3.75278 9.25 3.41699 9.58579 3.41699 10C3.41699 10.4142 3.75278 10.75 4.16699 10.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MoreHorizontalIcon
