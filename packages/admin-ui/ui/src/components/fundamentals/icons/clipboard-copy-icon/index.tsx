import React from "react"
import IconProps from "../types/icon-type"

const ClipboardCopyIcon: React.FC<IconProps> = ({
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
        d="M12.917 4.16669H14.3753C14.7621 4.16669 15.133 4.32277 15.4065 4.6006C15.68 4.87843 15.8337 5.25526 15.8337 5.64817V8.33335M7.08366 4.16669H5.62533C5.23855 4.16669 4.86762 4.32277 4.59413 4.6006C4.32064 4.87843 4.16699 5.25526 4.16699 5.64817V16.0185C4.16699 16.4115 4.32064 16.7883 4.59413 17.0661C4.86762 17.3439 5.23855 17.5 5.62533 17.5H14.3753C14.7621 17.5 15.133 17.3439 15.4065 17.0661C15.68 16.7883 15.8337 16.4115 15.8337 16.0185V15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.875 2.5H8.125C7.77982 2.5 7.5 2.8731 7.5 3.33333V5C7.5 5.46024 7.77982 5.83333 8.125 5.83333H11.875C12.2202 5.83333 12.5 5.46024 12.5 5V3.33333C12.5 2.8731 12.2202 2.5 11.875 2.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 11.6667H10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 9.16669L10 11.6667L12.5 14.1667"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ClipboardCopyIcon
