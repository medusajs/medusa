import React from "react"
import { IconProps } from ".."

const IconCircleMiniSolid: React.FC<IconProps> = ({
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
      <circle
        cx="10"
        cy="10"
        r="5.25"
        strokeWidth="1.5"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle"
        }
      />
    </svg>
  )
}

export default IconCircleMiniSolid
