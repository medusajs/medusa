import React from "react"
import IconProps from "../types/icon-type"

const SendIcon: React.FC<IconProps> = ({
  size = "24",
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
        d="M18.0893 3.08926C18.4147 2.76382 18.4147 2.23618 18.0893 1.91074C17.7638 1.58531 17.2362 1.58531 16.9107 1.91074L18.0893 3.08926ZM9.41074 9.41074L8.82149 10L10 11.1785L10.5893 10.5893L9.41074 9.41074ZM16.9107 1.91074L9.41074 9.41074L10.5893 10.5893L18.0893 3.08926L16.9107 1.91074Z"
        fill={color}
      />
      <path
        d="M17.5 2.5L12.25 17.5L9.25 10.75L2.5 7.75L17.5 2.5Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SendIcon
