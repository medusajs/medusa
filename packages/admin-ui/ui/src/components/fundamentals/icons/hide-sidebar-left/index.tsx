import { FC } from "react"
import IconProps from "../types/icon-type"

const HideSidebarLeftIcon: FC<IconProps> = ({
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
      d="M1 3.5C1 2.67157 1.67157 2 2.5 2H17.5C18.3284 2 19 2.67157 19 3.5V16.5C19 17.3284 18.3284 18 17.5 18H2.5C1.67157 18 1 17.3284 1 16.5V3.5Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path d="M6.5 2L6.5 18" stroke={color} strokeWidth="1.5" />
    <path
      d="M13.8284 7L11.3536 9.47488C11.1583 9.67014 11.1583 9.98672 11.3536 10.182L13.8284 12.6569"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default HideSidebarLeftIcon
