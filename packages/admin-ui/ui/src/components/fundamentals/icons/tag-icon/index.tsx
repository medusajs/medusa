import React from "react"
import IconProps from "../types/icon-type"

const TagIcon: React.FC<IconProps> = ({
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
        d="M20.4843 14.1202L14.1264 20.4797C13.9617 20.6447 13.7661 20.7755 13.5509 20.8648C13.3356 20.9541 13.1048 21 12.8717 21C12.6387 21 12.4079 20.9541 12.1926 20.8648C11.9773 20.7755 11.7817 20.6447 11.617 20.4797L4 12.8696V4H12.8673L20.4843 11.619C20.8146 11.9514 21 12.401 21 12.8696C21 13.3383 20.8146 13.7879 20.4843 14.1202V14.1202Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9H9.01006"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default TagIcon
