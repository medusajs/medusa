import React from "react"

import { IconProps } from "types/icon"

const Trash: React.FC<IconProps> = ({
  size = "16",
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
        d="M3.33301 5.49054H4.81449H16.6663"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.14286 5.5V4C7.14286 3.60218 7.29337 3.22064 7.56128 2.93934C7.82919 2.65804 8.19255 2.5 8.57143 2.5H11.4286C11.8075 2.5 12.1708 2.65804 12.4387 2.93934C12.7066 3.22064 12.8571 3.60218 12.8571 4V5.5M15 5.5V16C15 16.3978 14.8495 16.7794 14.5816 17.0607C14.3137 17.342 13.9503 17.5 13.5714 17.5H6.42857C6.04969 17.5 5.68633 17.342 5.41842 17.0607C5.15051 16.7794 5 16.3978 5 16V5.5H15Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33203 9.23724V13.4039"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.666 9.23724V13.4039"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default Trash
