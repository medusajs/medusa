import { IconProps } from "@medusajs/icons/dist/types"
import React from "react"

export const NavigationDropdownStoreIcon = (props: IconProps) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="20" height="20" className="fill-medusa-tag-purple-icon" />
      <g clipPath="url(#clip0_9988_95563)">
        <path
          d="M15.25 8.548C15.122 8.548 14.993 8.515 14.874 8.446L10 5.617L5.126 8.446C4.77 8.654 4.309 8.532 4.101 8.174C3.893 7.816 4.015 7.357 4.373 7.149L9.624 4.102C9.856 3.966 10.145 3.966 10.377 4.102L15.627 7.15C15.985 7.358 16.107 7.817 15.899 8.175C15.76 8.415 15.508 8.548 15.25 8.548Z"
          className="fill-medusa-fg-on-color"
        />
        <path
          d="M10 7.35195L5 10.254V13.75C5 14.715 5.785 15.5 6.75 15.5H9.25V13.25C9.25 12.836 9.586 12.5 10 12.5C10.414 12.5 10.75 12.836 10.75 13.25V15.5H13.25C14.215 15.5 15 14.715 15 13.75V10.254L10 7.35195Z"
          className="fill-medusa-fg-on-color"
        />
      </g>
      <defs>
        <clipPath id="clip0_9988_95563">
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
