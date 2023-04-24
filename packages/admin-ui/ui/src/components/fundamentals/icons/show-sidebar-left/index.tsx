import { FC } from "react"
import IconProps from "../types/icon-type"

const ShowSidebarLeftIcon: FC<IconProps> = ({
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
      d="M11.8284 7L14.3033 9.47488C14.4986 9.67014 14.4986 9.98672 14.3033 10.182L11.8284 12.6569"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default ShowSidebarLeftIcon
