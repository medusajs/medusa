import { IconProps } from "@medusajs/icons/dist/types"
import React from "react"

export const NavigationDropdownUiIcon = (props: IconProps) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="20" height="20" className="fill-medusa-tag-blue-icon" />
      <g clipPath="url(#clip0_9988_95578)">
        <path
          d="M14.18 10.472L9.28899 8.685C8.82599 8.518 8.32399 8.627 7.97699 8.975C7.62799 9.323 7.51699 9.826 7.68599 10.288L9.47199 15.178C9.65599 15.679 10.114 16 10.645 16C10.654 16 10.664 16 10.672 16C11.215 15.989 11.672 15.648 11.836 15.132L12.394 13.394L14.131 12.838C14.648 12.673 14.988 12.216 15 11.673C15.011 11.131 14.689 10.658 14.18 10.472Z"
          className="fill-medusa-fg-on-color"
        />
        <path
          d="M6.13499 11.894C6.05799 11.894 5.97999 11.882 5.90299 11.857C4.76499 11.487 4.00099 10.439 4.00099 9.25V7.75C3.99999 6.234 5.23299 5 6.74999 5H13.25C14.767 5 16 6.234 16 7.75V9.052C16 9.466 15.664 9.802 15.25 9.802C14.836 9.802 14.5 9.466 14.5 9.052V7.75C14.5 7.061 13.939 6.5 13.25 6.5H6.74999C6.06099 6.5 5.49999 7.061 5.49999 7.75V9.25C5.49999 9.788 5.84899 10.262 6.36699 10.43C6.76099 10.558 6.97599 10.981 6.84699 11.375C6.74399 11.692 6.45099 11.893 6.13399 11.893L6.13499 11.894Z"
          className="fill-medusa-fg-on-color"
        />
      </g>
      <defs>
        <clipPath id="clip0_9988_95578">
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
