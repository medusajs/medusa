import React from "react"
import { IconProps } from ".."

const IconReport: React.FC<IconProps> = ({ iconColorClassName, ...props }) => {
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
        d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.6665V9.99984"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13.3335H10.0088"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconReport
