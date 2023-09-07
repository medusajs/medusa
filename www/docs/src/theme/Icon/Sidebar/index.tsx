import React from "react"
import { IconProps } from ".."

const IconSidebar: React.FC<IconProps> = ({ iconColorClassName, ...props }) => {
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
        d="M9 3.125H4.375C3.87772 3.125 3.40081 3.32254 3.04917 3.67417C2.69754 4.02581 2.5 4.50272 2.5 5V6.875V15C2.5 15.4973 2.69754 15.9742 3.04917 16.3258C3.40081 16.6775 3.87772 16.875 4.375 16.875H9M9 3.125H15.625C16.1223 3.125 16.5992 3.32254 16.9508 3.67417C17.3025 4.02581 17.5 4.50272 17.5 5V6.875V15C17.5 15.4973 17.3025 15.9742 16.9508 16.3258C16.5992 16.6775 16.1223 16.875 15.625 16.875H9M9 3.125V16.875M5 6.5H6.5M5 9.5H6.5"
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

export default IconSidebar
