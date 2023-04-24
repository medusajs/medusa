import { FC } from "react"
import IconProps from "../types/icon-type"

const UnfoldMoreIcon: FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...attributes}
  >
    <path
      d="M9 15L11.6464 17.6464C11.8417 17.8417 12.1583 17.8417 12.3536 17.6464L15 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 9L11.6464 6.35355C11.8417 6.15829 12.1583 6.15829 12.3536 6.35355L15 9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default UnfoldMoreIcon
