import React from "react"
import IconProps from "../types/icon-type"

const CheckCircleFillIcon: React.FC<IconProps> = ({
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 10C18 14.4184 14.4184 18 10 18C5.5816 18 2 14.4184 2 10C2 5.5816 5.5816 2 10 2C14.4184 2 18 5.5816 18 10ZM13.9053 8.28033C14.1982 7.98744 14.1982 7.51256 13.9053 7.21967C13.6124 6.92678 13.1376 6.92678 12.8447 7.21967L8.875 11.1893L7.15533 9.46967C6.86244 9.17678 6.38756 9.17678 6.09467 9.46967C5.80178 9.76256 5.80178 10.2374 6.09467 10.5303L8.34467 12.7803C8.63756 13.0732 9.11244 13.0732 9.40533 12.7803L13.9053 8.28033Z"
        fill={color}
      />
    </svg>
  )
}

export default CheckCircleFillIcon
