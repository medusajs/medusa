import { IconProps } from "@medusajs/icons/dist/types"
import React from "react"

export const NavigationDropdownDocIcon = (props: IconProps) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        width="20"
        height="20"
        className="fill-medusa-fg-base dark:fill-medusa-bg-base"
      />
      <g clipPath="url(#clip0_9988_95547)">
        <path
          d="M14.25 16H7.25C6.009 16 5 14.991 5 13.75C5 13.336 5.336 13 5.75 13C6.164 13 6.5 13.336 6.5 13.75C6.5 14.164 6.836 14.5 7.25 14.5H14.25C14.664 14.5 15 14.836 15 15.25C15 15.664 14.664 16 14.25 16Z"
          className="fill-medusa-fg-on-color"
        />
        <path
          d="M12.75 4H7.25C6.009 4 5 5.009 5 6.25V13.75C5 14.164 5.336 14.5 5.75 14.5C6.164 14.5 6.5 14.164 6.5 13.75C6.5 13.336 6.836 13 7.25 13H14.25C14.664 13 15 12.664 15 12.25V6.25C15 5.009 13.991 4 12.75 4ZM11.25 9H8.75C8.336 9 8 8.664 8 8.25C8 7.836 8.336 7.5 8.75 7.5H11.25C11.664 7.5 12 7.836 12 8.25C12 8.664 11.664 9 11.25 9Z"
          className="fill-medusa-fg-on-color"
        />
      </g>
      <defs>
        <clipPath id="clip0_9988_95547">
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
