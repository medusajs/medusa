import React from "react"
import IconProps from "./types/icon-type"

const UTurnIcon: React.FC<IconProps> = ({
  size = "20px",
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
        d="M7.66703 12.3321L3.00098 7.66605M3.00098 7.66605L7.66703 3M3.00098 7.66605H12.3331C13.5706 7.66605 14.7574 8.15765 15.6325 9.03271C16.5075 9.90776 16.9991 11.0946 16.9991 12.3321C16.9991 13.5696 16.5075 14.7564 15.6325 15.6315C14.7574 16.5066 13.5706 16.9982 12.3331 16.9982H10.0001"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default UTurnIcon
