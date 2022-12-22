import React from "react"
import IconProps from "../types/icon-type"

const UploadIcon: React.FC<IconProps> = ({
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
        d="M16.0893 13.1868C16.6838 12.7754 17.1321 12.1858 17.3697 11.503C17.6072 10.8202 17.6216 10.0796 17.4107 9.38816C17.1999 8.69667 16.7748 8.09007 16.1968 7.65594C15.6187 7.2218 14.9177 6.9826 14.1948 6.97285H12.8308C12.6017 6.20011 12.1996 5.48973 11.6549 4.89565C11.1102 4.30157 10.4374 3.83943 9.68735 3.54431C8.93734 3.24918 8.12995 3.12885 7.32648 3.19244C6.52301 3.25603 5.7446 3.50187 5.05036 3.9113C4.35612 4.32072 3.7643 4.88297 3.31985 5.55533C2.8754 6.22769 2.59001 6.99248 2.48535 7.79164C2.38068 8.59079 2.4595 9.40329 2.71582 10.1674C2.97214 10.9316 3.39921 11.6272 3.96461 12.2016"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0273 10.0039V16.8241"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.0585 13.0351L10.0273 10.0039L6.99609 13.0351"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default UploadIcon
