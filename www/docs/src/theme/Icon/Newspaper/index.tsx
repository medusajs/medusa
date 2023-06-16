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
        d="M7.5 5.62501V12.5M12.5 7.50001V14.375M12.9192 17.29L16.9817 15.2592C17.2992 15.1008 17.5 14.7758 17.5 14.4208V4.01668C17.5 3.32001 16.7667 2.86668 16.1433 3.17834L12.9192 4.79001C12.655 4.92251 12.3442 4.92251 12.0808 4.79001L7.91917 2.71001C7.78901 2.64495 7.64551 2.61108 7.5 2.61108C7.35449 2.61108 7.21098 2.64495 7.08083 2.71001L3.01833 4.74084C2.7 4.90001 2.5 5.22501 2.5 5.57918V15.9833C2.5 16.68 3.23333 17.1333 3.85667 16.8217L7.08083 15.21C7.345 15.0775 7.65583 15.0775 7.91917 15.21L12.0808 17.2908C12.345 17.4225 12.6558 17.4225 12.9192 17.2908V17.29Z"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-secondary dark:tw-stroke-medusa-icon-secondary-dark"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.25H11.25M10 8.75H11.25M5 11.25H11.25M5 13.75H11.25M13.75 6.25H16.5625C17.08 6.25 17.5 6.67 17.5 7.1875V15C17.5 15.4973 17.3025 15.9742 16.9508 16.3258C16.5992 16.6775 16.1223 16.875 15.625 16.875M13.75 6.25V15C13.75 15.4973 13.9475 15.9742 14.2992 16.3258C14.6508 16.6775 15.1277 16.875 15.625 16.875M13.75 6.25V4.0625C13.75 3.545 13.33 3.125 12.8125 3.125H3.4375C2.92 3.125 2.5 3.545 2.5 4.0625V15C2.5 15.4973 2.69754 15.9742 3.04917 16.3258C3.40081 16.6775 3.87772 16.875 4.375 16.875H15.625M5 6.25H7.5V8.75H5V6.25Z"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-secondary dark:tw-stroke-medusa-icon-secondary-dark"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconNewspaper
