import React from "react"
import IconProps from "./types/icon-type"

const GripIcon: React.FC<IconProps> = ({
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
        d="M7.49935 10.8337C7.95959 10.8337 8.33268 10.4606 8.33268 10.0003C8.33268 9.54009 7.95959 9.16699 7.49935 9.16699C7.03911 9.16699 6.66602 9.54009 6.66602 10.0003C6.66602 10.4606 7.03911 10.8337 7.49935 10.8337Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.49935 4.99967C7.95959 4.99967 8.33268 4.62658 8.33268 4.16634C8.33268 3.7061 7.95959 3.33301 7.49935 3.33301C7.03911 3.33301 6.66602 3.7061 6.66602 4.16634C6.66602 4.62658 7.03911 4.99967 7.49935 4.99967Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.49935 16.6667C7.95959 16.6667 8.33268 16.2936 8.33268 15.8333C8.33268 15.3731 7.95959 15 7.49935 15C7.03911 15 6.66602 15.3731 6.66602 15.8333C6.66602 16.2936 7.03911 16.6667 7.49935 16.6667Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.4993 10.8337C12.9596 10.8337 13.3327 10.4606 13.3327 10.0003C13.3327 9.54009 12.9596 9.16699 12.4993 9.16699C12.0391 9.16699 11.666 9.54009 11.666 10.0003C11.666 10.4606 12.0391 10.8337 12.4993 10.8337Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.4993 4.99967C12.9596 4.99967 13.3327 4.62658 13.3327 4.16634C13.3327 3.7061 12.9596 3.33301 12.4993 3.33301C12.0391 3.33301 11.666 3.7061 11.666 4.16634C11.666 4.62658 12.0391 4.99967 12.4993 4.99967Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.4993 16.6667C12.9596 16.6667 13.3327 16.2936 13.3327 15.8333C13.3327 15.3731 12.9596 15 12.4993 15C12.0391 15 11.666 15.3731 11.666 15.8333C11.666 16.2936 12.0391 16.6667 12.4993 16.6667Z"
        stroke={color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default GripIcon
