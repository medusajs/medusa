import { IconProps } from "@medusajs/icons/dist/types"
import clsx from "clsx"
import React from "react"

const IconBeaker = (props: IconProps) => {
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
        d="M8.12499 2.5865V7.34817C8.12499 7.5944 8.0765 7.83822 7.98227 8.0657C7.88805 8.29319 7.74993 8.49989 7.57583 8.674L4.16666 12.0832M8.12499 2.5865C7.91583 2.60567 7.70749 2.62817 7.49999 2.65483M8.12499 2.5865C9.3723 2.47052 10.6277 2.47052 11.875 2.5865M4.16666 12.0832L4.80833 11.9223C6.55249 11.4913 8.39317 11.6961 9.99999 12.4998C11.6068 13.3036 13.4475 13.5083 15.1917 13.0773L16.5 12.7498M4.16666 12.0832L2.33166 13.919C1.30416 14.9448 1.78916 16.6832 3.22083 16.9273C5.42416 17.304 7.68916 17.4998 9.99999 17.4998C12.2718 17.5006 14.5396 17.3091 16.7792 16.9273C18.21 16.6832 18.695 14.9448 17.6683 13.9182L16.5 12.7498M11.875 2.5865V7.34817C11.875 7.84567 12.0725 8.32317 12.4242 8.674L16.5 12.7498M11.875 2.5865C12.0842 2.60567 12.2925 2.62817 12.5 2.65483"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconBeaker
