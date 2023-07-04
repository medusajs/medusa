import React from "react"
import IconProps from "../types/icon-type"

type TagDotIconProps = IconProps & {
  outerColor: string
}

const TagDotIcon: React.FC<TagDotIconProps> = ({
  size = "24px",
  color = "#E5484D",
  outerColor = "transparent",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <circle cx="16" cy="16" r="6" fill={outerColor} />
      <circle cx="16" cy="16" r="3" fill={color} />
    </svg>
  )
}

export default TagDotIcon
