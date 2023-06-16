import React from "react"
import { IconProps } from ".."

const IconBackArow: React.FC<IconProps> = ({
  iconColorClassName,
  ...props
}) => {
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
        d="M7.66703 12.3331L3.00098 7.66703M3.00098 7.66703L7.66703 3.00098M3.00098 7.66703H12.3331C13.5706 7.66703 14.7574 8.15863 15.6325 9.03368C16.5075 9.90874 16.9991 11.0956 16.9991 12.3331C16.9991 13.5706 16.5075 14.7574 15.6325 15.6325C14.7574 16.5075 13.5706 16.9991 12.3331 16.9991H10.0001"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconBackArow
