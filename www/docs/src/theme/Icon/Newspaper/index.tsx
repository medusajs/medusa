import React from "react"
import { IconProps } from ".."

const IconNewspaper: React.FC<IconProps> = ({
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
        d="M10 6.25H11.25M10 8.75H11.25M5 11.25H11.25M5 13.75H11.25M13.75 6.25H16.5625C17.08 6.25 17.5 6.67 17.5 7.1875V15C17.5 15.4973 17.3025 15.9742 16.9508 16.3258C16.5992 16.6775 16.1223 16.875 15.625 16.875M13.75 6.25V15C13.75 15.4973 13.9475 15.9742 14.2992 16.3258C14.6508 16.6775 15.1277 16.875 15.625 16.875M13.75 6.25V4.0625C13.75 3.545 13.33 3.125 12.8125 3.125H3.4375C2.92 3.125 2.5 3.545 2.5 4.0625V15C2.5 15.4973 2.69754 15.9742 3.04917 16.3258C3.40081 16.6775 3.87772 16.875 4.375 16.875H15.625M5 6.25H7.5V8.75H5V6.25Z"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle-dark"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconNewspaper
