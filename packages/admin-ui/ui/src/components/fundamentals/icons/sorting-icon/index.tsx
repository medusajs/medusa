import clsx from "clsx"
import React from "react"
import IconProps from "../types/icon-type"

type SortingIconProps = {
  ascendingColor?: string
  descendingColor?: string
  isSorted?: "asc" | "desc" | false
} & IconProps

const SortingIcon: React.FC<SortingIconProps> = ({
  size = "24",
  color = "currentColor",
  ascendingColor,
  descendingColor,
  isSorted = false,
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M4.66602 10L7.99935 13.3333L11.3327 10"
        className={clsx({
          "stroke-grey-40": isSorted !== "desc",
          "stroke-current": isSorted === "desc",
        })}
        stroke={descendingColor || color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66602 6.00008L7.99935 2.66675L11.3327 6.00008"
        stroke={ascendingColor || color}
        className={clsx({
          "stroke-grey-40": isSorted !== "asc",
          "stroke-current": isSorted === "asc",
        })}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SortingIcon
