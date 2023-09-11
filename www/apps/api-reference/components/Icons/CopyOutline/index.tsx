import React from "react"
import IconProps from "../types"

const IconCopyOutline = ({ iconColorClassName, ...props }: IconProps) => {
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
        d="M13.75 6.875V5C13.75 4.50272 13.5525 4.02581 13.2008 3.67417C12.8492 3.32254 12.3723 3.125 11.875 3.125H5C4.50272 3.125 4.02581 3.32254 3.67417 3.67417C3.32254 4.02581 3.125 4.50272 3.125 5V11.875C3.125 12.3723 3.32254 12.8492 3.67417 13.2008C4.02581 13.5525 4.50272 13.75 5 13.75H6.875M13.75 6.875H15C15.4973 6.875 15.9742 7.07254 16.3258 7.42417C16.6775 7.77581 16.875 8.25272 16.875 8.75V15C16.875 15.4973 16.6775 15.9742 16.3258 16.3258C15.9742 16.6775 15.4973 16.875 15 16.875H8.75C8.25272 16.875 7.77581 16.6775 7.42417 16.3258C7.07254 15.9742 6.875 15.4973 6.875 15V13.75M13.75 6.875H8.75C8.25272 6.875 7.77581 7.07254 7.42417 7.42417C7.07254 7.77581 6.875 8.25272 6.875 8.75V13.75"
        className={
          iconColorClassName ||
          "stroke-medusa-fg-subtle dark:stroke-medusa-fg-subtle-dark"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconCopyOutline
