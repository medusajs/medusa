import React from "react"
import IconProps from "../types/icon-type"

const BackIcon: React.FC<IconProps> = ({
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
        d="M3.33301 2.91669V7.91669H8.33301"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.41396 11.6784C3.57168 13.1642 4.14444 13.9943 5.18922 15.0653C6.23401 16.1363 7.6093 16.8262 9.0944 17.0244C10.5795 17.2226 12.0883 16.9175 13.3787 16.1581C14.6691 15.3988 15.6663 14.2291 16.2103 12.8369C16.7542 11.4446 16.8134 9.91052 16.3783 8.48073C15.9432 7.05094 15.039 5.80836 13.8109 4.95238C12.5828 4.0964 11.1019 3.67666 9.60596 3.76051C8.10998 3.84436 6.68561 4.42693 5.56142 5.41475L3.33301 7.41474"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default BackIcon
