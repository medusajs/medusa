import { FC } from "react"
import IconProps from "../types/icon-type"

const LibraryIcon: FC<IconProps> = ({
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
      d="M4.5 3.75H15.5C15.9142 3.75 16.25 4.08579 16.25 4.5V7.5C16.25 7.91421 15.9142 8.25 15.5 8.25H4.5C4.08579 8.25 3.75 7.91421 3.75 7.5V4.5C3.75 4.08579 4.08579 3.75 4.5 3.75Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M4.5 11.75H15.5C15.9142 11.75 16.25 12.0858 16.25 12.5V15.5C16.25 15.9142 15.9142 16.25 15.5 16.25H4.5C4.08579 16.25 3.75 15.9142 3.75 15.5V12.5C3.75 12.0858 4.08579 11.75 4.5 11.75Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M4.5 11.75H7.5C7.91421 11.75 8.25 12.0858 8.25 12.5V15.5C8.25 15.9142 7.91421 16.25 7.5 16.25H4.5C4.08579 16.25 3.75 15.9142 3.75 15.5V12.5C3.75 12.0858 4.08579 11.75 4.5 11.75Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M12.5 3.75H15.5C15.9142 3.75 16.25 4.08579 16.25 4.5V7.5C16.25 7.91421 15.9142 8.25 15.5 8.25H12.5C12.0858 8.25 11.75 7.91421 11.75 7.5V4.5C11.75 4.08579 12.0858 3.75 12.5 3.75Z"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
)

export default LibraryIcon
