import React from "react"
import IconProps from "../types/icon-type"

const TruckIcon: React.FC<IconProps> = ({
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
        d="M10.2 16H13.8M13.8 16V5H3V16H5M13.8 16V8.66667H18.3L19.947 10.3442C20.2812 10.6849 20.5462 11.0894 20.7269 11.5346C20.9076 11.9797 21.0004 12.4567 21 12.9383V16H19.2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 19C8.88071 19 10 17.8807 10 16.5C10 15.1193 8.88071 14 7.5 14C6.11929 14 5 15.1193 5 16.5C5 17.8807 6.11929 19 7.5 19Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 19C17.8807 19 19 17.8807 19 16.5C19 15.1193 17.8807 14 16.5 14C15.1193 14 14 15.1193 14 16.5C14 17.8807 15.1193 19 16.5 19Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default TruckIcon
