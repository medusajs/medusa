import { IconProps } from "@medusajs/icons/dist/types"
import React from "react"

export const NavigationDropdownResourcesIcon = (props: IconProps) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="20" height="20" className="fill-medusa-tag-orange-icon" />
      <g clipPath="url(#clip0_9988_95555)">
        <path
          d="M15.25 12C14.836 12 14.5 11.664 14.5 11.25V8.75C14.5 8.061 13.939 7.5 13.25 7.5H10.614C10.386 7.5 10.172 7.397 10.029 7.219L9.425 6.467C9.187 6.17 8.831 6 8.45 6H6.749C6.06 6 5.499 6.561 5.499 7.25V11.25C5.499 11.664 5.163 12 4.749 12C4.335 12 3.999 11.664 3.999 11.25V7.25C4 5.733 5.233 4.5 6.75 4.5H8.451C9.289 4.5 10.07 4.875 10.596 5.528L10.974 6H13.25C14.767 6 16 7.233 16 8.75V11.25C16 11.664 15.664 12 15.25 12Z"
          className="fill-medusa-fg-on-color"
        />
        <path
          d="M13.25 8.5H6.75C5.23122 8.5 4 9.73122 4 11.25V12.75C4 14.2688 5.23122 15.5 6.75 15.5H13.25C14.7688 15.5 16 14.2688 16 12.75V11.25C16 9.73122 14.7688 8.5 13.25 8.5Z"
          className="fill-medusa-fg-on-color"
        />
      </g>
      <defs>
        <clipPath id="clip0_9988_95555">
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
