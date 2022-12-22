import React from "react"
import IconProps from "../types/icon-type"

const MailIcon: React.FC<IconProps> = ({
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
        d="M4.8 5H19.2C20.19 5 21 5.7875 21 6.75V17.25C21 18.2125 20.19 19 19.2 19H4.8C3.81 19 3 18.2125 3 17.25V6.75C3 5.7875 3.81 5 4.8 5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 6L12 12L4 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MailIcon
