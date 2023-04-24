import { FC } from "react"
import IconProps from "../types/icon-type"

const ResizeHorizontalSquareIcon: FC<IconProps> = ({
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
      d="M3 5.25C3 4.00736 4.00736 3 5.25 3H18.75C19.9926 3 21 4.00736 21 5.25V18.75C21 19.9926 19.9926 21 18.75 21H5.25C4.00736 21 3 19.9926 3 18.75V5.25Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path d="M7 12H17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M9 9L6.35355 11.6464C6.15829 11.8417 6.15829 12.1583 6.35355 12.3536L9 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M15 9L17.6464 11.6464C17.8417 11.8417 17.8417 12.1583 17.6464 12.3536L15 15"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default ResizeHorizontalSquareIcon
