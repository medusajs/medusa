import React from "react"
import IconProps from "../types/icon-type"

const BackspaceIcon: React.FC<IconProps> = ({
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
    >
      <path
        d="M7.5 6.66675L10.1667 9.33341"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.1667 6.66675L7.5 9.33341"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.56137 11.8559L2.55004 9.49392H2.55004C1.81665 8.63293 1.81665 7.36691 2.55004 6.50592L4.56137 4.14392V4.14392C4.9991 3.62949 5.64058 3.33312 6.31604 3.33325H11.6954V3.33325C12.9682 3.33325 14 4.36509 14 5.63792C14 5.63792 14 5.63792 14 5.63792V10.3619V10.3619C14 11.6348 12.9682 12.6666 11.6954 12.6666H6.31604V12.6666C5.64058 12.6667 4.99911 12.3704 4.56137 11.8559V11.8559Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default BackspaceIcon
