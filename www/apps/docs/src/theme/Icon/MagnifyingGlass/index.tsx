import React from "react"
import { IconProps } from ".."

const IconMagnifyingGlass: React.FC<IconProps> = ({
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
        d="M17.4999 17.8713L13.1691 13.5404M13.1691 13.5404C14.3412 12.3683 14.9997 10.7785 14.9997 9.12084C14.9997 7.46317 14.3412 5.8734 13.1691 4.70126C11.9969 3.52911 10.4072 2.87061 8.7495 2.87061C7.09184 2.87061 5.50207 3.52911 4.32992 4.70126C3.15777 5.8734 2.49927 7.46317 2.49927 9.12084C2.49927 10.7785 3.15777 12.3683 4.32992 13.5404C5.50207 14.7126 7.09184 15.3711 8.7495 15.3711C10.4072 15.3711 11.9969 14.7126 13.1691 13.5404V13.5404Z"
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

export default IconMagnifyingGlass
