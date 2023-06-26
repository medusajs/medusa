import React from "react"
import { IconProps } from ".."

const IconMap: React.FC<IconProps> = ({ iconColorClassName, ...props }) => {
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
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle-dark"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconMap
