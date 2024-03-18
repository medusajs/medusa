import { IconProps } from "@medusajs/icons/dist/types"
import clsx from "clsx"
import React from "react"

export const IconCircleDottedLine = (props: IconProps) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={clsx("text-ui-fg-subtle", props.className)}
    >
      <path
        d="M12.5 2.93589C10.884 2.3547 9.116 2.3547 7.5 2.93589"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.63049 8.63198C2.94295 6.94471 3.82573 5.41606 5.13094 4.30209"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.13094 15.6979C3.82575 14.5839 2.94298 13.0552 2.63049 11.368"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 17.0641C9.116 17.6453 10.884 17.6453 12.5 17.0641"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.3695 8.63198C17.057 6.94471 16.1742 5.41606 14.869 4.30209"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.869 15.6979C16.1742 14.5839 17.057 13.0552 17.3695 11.368"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
