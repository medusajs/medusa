import React from "react"
import IconProps from "./types/icon-type"

const DuplicateIcon: React.FC<IconProps> = ({
  size = "20px",
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
        d="M16.0894 8.33333H9.74326C8.9644 8.33333 8.33301 8.96472 8.33301 9.74358V16.0897C8.33301 16.8686 8.9644 17.5 9.74326 17.5H16.0894C16.8683 17.5 17.4997 16.8686 17.4997 16.0897V9.74358C17.4997 8.96472 16.8683 8.33333 16.0894 8.33333Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.61538 11.6667H3.91026C3.53623 11.6667 3.17753 11.5181 2.91305 11.2536C2.64858 10.9891 2.5 10.6304 2.5 10.2564V3.91026C2.5 3.53623 2.64858 3.17753 2.91305 2.91305C3.17753 2.64858 3.53623 2.5 3.91026 2.5H10.2564C10.6304 2.5 10.9891 2.64858 11.2536 2.91305C11.5181 3.17753 11.6667 3.53623 11.6667 3.91026V4.61538"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default DuplicateIcon
