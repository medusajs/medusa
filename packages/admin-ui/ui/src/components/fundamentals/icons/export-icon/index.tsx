import React from "react"
import IconProps from "../types/icon-type"

const ExportIcon: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M17.5 13V15.6667C17.5 16.0203 17.3361 16.3594 17.0444 16.6095C16.7527 16.8595 16.357 17 15.9444 17H5.05556C4.643 17 4.24733 16.8595 3.95561 16.6095C3.66389 16.3594 3.5 16.0203 3.5 15.6667V13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6673 6.92057L10.5007 2.75391L6.33398 6.92057"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 2.75391V12.7539"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ExportIcon
