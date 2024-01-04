import { IconProps } from "@medusajs/icons/dist/types"
import clsx from "clsx"
import React from "react"

const IconFlagMini = (props: IconProps) => {
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
        d="M5 4V5.51664M5 5.51664L6.51482 5.05445C7.65471 4.70701 8.85891 4.86835 9.90977 5.5093L9.96883 5.54531C10.9985 6.1731 12.1759 6.34089 13.2965 6.0195L14.9973 5.53131C14.7905 7.8586 14.7914 10.2064 15 12.5334L13.2971 13.0216C12.1764 13.3434 10.9987 13.1758 9.96883 12.5481L9.90977 12.5121C8.85891 11.8711 7.65471 11.7098 6.51482 12.0572L5 12.5194M5 5.51664V12.5194M5 16V12.5194"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconFlagMini
