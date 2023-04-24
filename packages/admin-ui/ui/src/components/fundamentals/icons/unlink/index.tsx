import { FC } from "react"
import IconProps from "../types/icon-type"

const UnlinkIcon: FC<IconProps> = ({
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
      d="M12.5 6H14C16.2091 6 18 7.79086 18 10V10C18 12.2091 16.2091 14 14 14H12.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7.5 6H6C3.79086 6 2 7.79086 2 10V10C2 12.2091 3.79086 14 6 14H7.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default UnlinkIcon
