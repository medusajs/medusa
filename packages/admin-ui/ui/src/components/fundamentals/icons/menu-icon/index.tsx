import React from "react"
import IconProps from "../types/icon-type"

const MenuIcon: React.FC<IconProps> = ({
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
        //d="M3.75 6.75H20.25M3.75 12H20.25M3.75 17.25H20.25" // 3 bars
        d="M3.75 5.25H20.25M3.75 9.75H20.25M3.75 14.25H20.25M3.75 18.75H20.25" // 4 bars
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MenuIcon
