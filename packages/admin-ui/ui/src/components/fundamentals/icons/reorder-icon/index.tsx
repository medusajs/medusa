import React from "react"
import IconProps from "../types/icon-type"

const ReorderIcon: React.FC<IconProps> = ({
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
        d="M7.5 10.75C7.91421 10.75 8.25 10.4142 8.25 10C8.25 9.58579 7.91421 9.25 7.5 9.25C7.08579 9.25 6.75 9.58579 6.75 10C6.75 10.4142 7.08579 10.75 7.5 10.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 5.75C7.91421 5.75 8.25 5.41421 8.25 5C8.25 4.58579 7.91421 4.25 7.5 4.25C7.08579 4.25 6.75 4.58579 6.75 5C6.75 5.41421 7.08579 5.75 7.5 5.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 15.75C7.91421 15.75 8.25 15.4142 8.25 15C8.25 14.5858 7.91421 14.25 7.5 14.25C7.08579 14.25 6.75 14.5858 6.75 15C6.75 15.4142 7.08579 15.75 7.5 15.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 10.75C12.9142 10.75 13.25 10.4142 13.25 10C13.25 9.58579 12.9142 9.25 12.5 9.25C12.0858 9.25 11.75 9.58579 11.75 10C11.75 10.4142 12.0858 10.75 12.5 10.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 5.75C12.9142 5.75 13.25 5.41421 13.25 5C13.25 4.58579 12.9142 4.25 12.5 4.25C12.0858 4.25 11.75 4.58579 11.75 5C11.75 5.41421 12.0858 5.75 12.5 5.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 15.75C12.9142 15.75 13.25 15.4142 13.25 15C13.25 14.5858 12.9142 14.25 12.5 14.25C12.0858 14.25 11.75 14.5858 11.75 15C11.75 15.4142 12.0858 15.75 12.5 15.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ReorderIcon
