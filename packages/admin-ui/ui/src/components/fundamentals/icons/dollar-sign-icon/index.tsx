import React from "react"
import IconProps from "../types/icon-type"

const DollarSignIcon: React.FC<IconProps> = ({
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
        d="M12 3V21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 6H9.5C8.57174 6 7.6815 6.31607 7.02513 6.87868C6.36875 7.44129 6 8.20435 6 9C6 9.79565 6.36875 10.5587 7.02513 11.1213C7.6815 11.6839 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3161 16.9749 12.8787C17.6313 13.4413 18 14.2044 18 15C18 15.7956 17.6313 16.5587 16.9749 17.1213C16.3185 17.6839 15.4283 18 14.5 18H6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default DollarSignIcon
