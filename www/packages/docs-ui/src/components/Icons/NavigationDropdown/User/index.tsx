import { IconProps } from "@medusajs/icons/dist/types"
import React from "react"

export const NavigationDropdownUserIcon = (props: IconProps) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="20" height="20" className="fill-medusa-tag-red-icon" />
      <g clipPath="url(#clip0_10088_101526)">
        <path
          d="M10 8.99097C11.3807 8.99097 12.5 7.87168 12.5 6.49097C12.5 5.11025 11.3807 3.99097 10 3.99097C8.61929 3.99097 7.5 5.11025 7.5 6.49097C7.5 7.87168 8.61929 8.99097 10 8.99097Z"
          className="fill-medusa-fg-on-color"
        />
        <path
          d="M14.533 12.639C13.601 11.011 11.864 10 10 10C8.136 10 6.398 11.011 5.467 12.639C5.218 13.073 5.162 13.593 5.313 14.067C5.463 14.539 5.809 14.93 6.26 15.139C7.501 15.713 8.75 16 10 16C11.25 16 12.499 15.713 13.74 15.139C14.191 14.93 14.536 14.539 14.687 14.067C14.838 13.593 14.782 13.073 14.533 12.64V12.639Z"
          className="fill-medusa-fg-on-color"
        />
      </g>
      <defs>
        <clipPath id="clip0_10088_101526">
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
