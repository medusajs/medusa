import React from "react"
import IconProps from "../types/icon-type"

const ArrowUTurnLeftIcon: React.FC<IconProps> = ({
  size = "24",
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
        d="M7.66605 12.3331L3 7.66703M3 7.66703L7.66605 3.00098M3 7.66703H12.3321C13.5696 7.66703 14.7564 8.15863 15.6315 9.03368C16.5066 9.90874 16.9982 11.0956 16.9982 12.3331C16.9982 13.5706 16.5066 14.7574 15.6315 15.6325C14.7564 16.5075 13.5696 16.9991 12.3321 16.9991H9.99908"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowUTurnLeftIcon
