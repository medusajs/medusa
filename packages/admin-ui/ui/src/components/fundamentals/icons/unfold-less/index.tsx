import { FC } from "react"
import IconProps from "../types/icon-type"

const UnfoldLessIcon: FC<IconProps> = ({
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
      d="M9 18L11.6464 15.3536C11.8417 15.1583 12.1583 15.1583 12.3536 15.3536L15 18"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 6L11.6464 8.64645C11.8417 8.84171 12.1583 8.84171 12.3536 8.64645L15 6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default UnfoldLessIcon
