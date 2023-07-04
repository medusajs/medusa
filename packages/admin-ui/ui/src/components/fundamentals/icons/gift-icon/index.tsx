import React from "react"
import IconProps from "../types/icon-type"

const GiftIcon: React.FC<IconProps> = ({
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
        d="M19 11.5V19.5H5V11.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 7.5H3V11.5H21V7.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 19.5V7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.5H8.14286C7.57454 7.5 7.02949 7.23661 6.62763 6.76777C6.22576 6.29893 6 5.66304 6 5C6 4.33696 6.22576 3.70107 6.62763 3.23223C7.02949 2.76339 7.57454 2.5 8.14286 2.5C11.1429 2.5 12 7.5 12 7.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.5H15.8571C16.4255 7.5 16.9705 7.23661 17.3724 6.76777C17.7742 6.29893 18 5.66304 18 5C18 4.33696 17.7742 3.70107 17.3724 3.23223C16.9705 2.76339 16.4255 2.5 15.8571 2.5C12.8571 2.5 12 7.5 12 7.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default GiftIcon
