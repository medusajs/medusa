import { FC } from "react"
import IconProps from "../types/icon-type"

const SidebarLeftIcon: FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...attributes}
  >
    <path
      d="M1 4.5C1 3.67157 1.67157 3 2.5 3H17.5C18.3284 3 19 3.67157 19 4.5V15.5C19 16.3284 18.3284 17 17.5 17H2.5C1.67157 17 1 16.3284 1 15.5V4.5Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path d="M8.5 3L8.5 16.5" stroke={color} strokeWidth="1.5" />
    <path
      d="M3.5 6H6M3.5 8.5H6M3.5 11H6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default SidebarLeftIcon
