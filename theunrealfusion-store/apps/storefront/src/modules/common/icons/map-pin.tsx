import React from "react"

import { IconProps } from "types/icon"

const MapPin: React.FC<IconProps> = ({
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
        d="M15.8337 8.63636C15.8337 13.4091 10.0003 17.5 10.0003 17.5C10.0003 17.5 4.16699 13.4091 4.16699 8.63636C4.16699 7.0089 4.78157 5.44809 5.87554 4.2973C6.9695 3.14651 8.45323 2.5 10.0003 2.5C11.5474 2.5 13.0312 3.14651 14.1251 4.2973C15.2191 5.44809 15.8337 7.0089 15.8337 8.63636Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99967 9.99996C10.9201 9.99996 11.6663 9.25377 11.6663 8.33329C11.6663 7.41282 10.9201 6.66663 9.99967 6.66663C9.0792 6.66663 8.33301 7.41282 8.33301 8.33329C8.33301 9.25377 9.0792 9.99996 9.99967 9.99996Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MapPin
