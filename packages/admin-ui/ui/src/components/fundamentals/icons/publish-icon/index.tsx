import React from "react"
import IconProps from "../types/icon-type"

const PublishIcon: React.FC<IconProps> = ({
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
        d="M9.16667 3.33334H4C3.60218 3.33334 3.22064 3.48385 2.93934 3.75176C2.65804 4.01967 2.5 4.38303 2.5 4.76191V11.9048C2.5 12.2837 2.65804 12.647 2.93934 12.9149C3.22064 13.1828 3.60218 13.3333 4 13.3333H16C16.3978 13.3333 16.7794 13.1828 17.0607 12.9149C17.342 12.647 17.5 12.2837 17.5 11.9048V11.6667"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.08301 16.6667H12.9163"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13.3333V16.6667"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.333 7.50001L17.4997 3.33334"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.333 3.33334H17.4997V7.50001"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PublishIcon
