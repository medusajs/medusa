import React from "react"
import IconProps from "./types/icon-type"

const RefreshIcon: React.FC<IconProps> = ({
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
        d="M16.5004 2.77765V7.11104H12.167"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 9.99997C3.50114 8.74568 3.86516 7.51851 4.54814 6.46647C5.23113 5.41444 6.2039 4.58248 7.34914 4.07094C8.49438 3.5594 9.76316 3.39013 11.0024 3.58355C12.2417 3.77697 13.3986 4.32482 14.3335 5.16101L16.5002 7.11104"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 17.2223V12.8889H7.83339"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5002 10C16.499 11.2543 16.135 12.4815 15.452 13.5335C14.7691 14.5855 13.7963 15.4175 12.651 15.929C11.5058 16.4406 10.237 16.6098 8.99773 16.4164C7.75845 16.223 6.60159 15.6751 5.6667 14.839L3.5 12.8889"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default RefreshIcon
