import React from "react"
import { IconProps } from ".."

const IconClose: React.FC<IconProps> = (props) => {
  return (
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 14L14 6M6 6L14 14"
        stroke="var(--ifm-icon-color)"
        strokeWidth={props.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconClose
