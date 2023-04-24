import { FC } from "react"
import IconProps from "../types/icon-type"

const ResizeHorizontalIcon: FC<IconProps> = ({
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
      d="M6 5.5L1.85355 9.64645C1.65829 9.84171 1.65829 10.1583 1.85355 10.3536L6 14.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 5.5L18.1464 9.64645C18.3417 9.84171 18.3417 10.1583 18.1464 10.3536L14 14.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M3 10H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default ResizeHorizontalIcon
