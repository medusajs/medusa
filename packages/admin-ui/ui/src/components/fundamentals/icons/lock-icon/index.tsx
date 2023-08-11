import React from "react"
import IconProps from "../types/icon-type"

const LockIcon: React.FC<IconProps> = ({
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
        d="M15.1849 8.33334H4.81449C3.99629 8.33334 3.33301 9.0117 3.33301 9.8485V15.1515C3.33301 15.9883 3.99629 16.6667 4.81449 16.6667H15.1849C16.0031 16.6667 16.6663 15.9883 16.6663 15.1515V9.8485C16.6663 9.0117 16.0031 8.33334 15.1849 8.33334Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66699 8.33333V5.74074C6.66699 4.88124 7.01818 4.05695 7.6433 3.44919C8.26842 2.84143 9.11627 2.5 10.0003 2.5C10.8844 2.5 11.7322 2.84143 12.3573 3.44919C12.9825 4.05695 13.3337 4.88124 13.3337 5.74074V8.33333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default LockIcon
