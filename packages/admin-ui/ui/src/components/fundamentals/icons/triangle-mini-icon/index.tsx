import React from "react"
import IconProps from "../types/icon-type"

const TriangleDownIcon: React.FC<IconProps> = ({
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
        d="M13.0869 6.25006C13.7804 6.25006 14.22 7.00005 13.8859 7.61318L10.7988 13.2737C10.4525 13.9089 9.54748 13.9089 9.20123 13.2737L6.1141 7.61368C5.78 7.00054 6.21963 6.25055 6.91312 6.25055L13.0869 6.25006Z"
        fill={color}
      />
    </svg>
  )
}

export default TriangleDownIcon
