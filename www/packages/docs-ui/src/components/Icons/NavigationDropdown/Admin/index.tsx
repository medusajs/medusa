import { IconProps } from "@medusajs/icons/dist/types"
import React from "react"

export const NavigationDropdownAdminIcon = (props: IconProps) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="20" height="20" className="fill-medusa-tag-green-icon" />
      <g clipPath="url(#clip0_9988_95571)">
        <path
          d="M13.25 4.5H6.75C5.233 4.5 4 5.733 4 7.25V12.75C4 14.267 5.233 15.5 6.75 15.5H13.25C14.767 15.5 16 14.267 16 12.75V7.25C16 5.733 14.767 4.5 13.25 4.5ZM6.5 8C5.948 8 5.5 7.552 5.5 7C5.5 6.448 5.948 6 6.5 6C7.052 6 7.5 6.448 7.5 7C7.5 7.552 7.052 8 6.5 8ZM9.5 8C8.948 8 8.5 7.552 8.5 7C8.5 6.448 8.948 6 9.5 6C10.052 6 10.5 6.448 10.5 7C10.5 7.552 10.052 8 9.5 8Z"
          className="fill-medusa-fg-on-color"
        />
      </g>
      <defs>
        <clipPath id="clip0_9988_95571">
          <rect
            width="12"
            height="12"
            className="fill-medusa-fg-on-color"
            transform="translate(4 4)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
