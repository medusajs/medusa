import React from "react"
import IconProps from "../types/icon-type"

const TriangleRightIcon: React.FC<IconProps> = ({
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.6469 8.76191L8.88455 6.00494C8.40459 5.65352 7.82341 5.68718 7.39745 5.97365C6.98931 6.24815 6.75 6.72509 6.75 7.24299V12.7572C6.75 13.275 6.98929 13.7521 7.39756 14.0265C7.8237 14.313 8.4047 14.3465 8.88451 13.9949M8.88451 13.9949L12.6469 11.2382C13.0771 10.9231 13.25 10.4291 13.25 10.0001C13.25 9.57108 13.0771 9.07707 12.6469 8.76191"
        fill={color}
      />
    </svg>
  )
}

export default TriangleRightIcon
