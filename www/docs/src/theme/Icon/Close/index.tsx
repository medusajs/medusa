import React from "react"
import { IconProps } from ".."

const IconClose: React.FC<IconProps> = ({ iconColorClassName, ...props }) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 14L14 6M6 6L14 14"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-secondary dark:tw-stroke-medusa-icon-secondary"
        }
        strokeWidth={props.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconClose
