import React from "react"
import IconProps from "./types/icon-type"

const RefundIcon: React.FC<IconProps> = ({
  size = "24px",
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
        d="M2.5 5.83398H17.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.97565 9.16602H5.83398"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 14.1667H5C3.61917 14.1667 2.5 13.0475 2.5 11.6667V5C2.5 3.61917 3.61917 2.5 5 2.5H15C16.3808 2.5 17.5 3.61917 17.5 5V8.33333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3249 14.166L11.6582 15.8327L13.3249 17.4993"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9993 12.5H15.8327C16.7535 12.5 17.4993 13.2458 17.4993 14.1667C17.4993 15.0875 16.7535 15.8333 15.8327 15.8333H11.666"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default RefundIcon
