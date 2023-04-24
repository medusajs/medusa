import { FC } from "react"
import IconProps from "../types/icon-type"

const LibraryAddIcon: FC<IconProps> = ({
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
      d="M3.5 3.75H14.5C14.9142 3.75 15.25 4.08579 15.25 4.5V7.5C15.25 7.91421 14.9142 8.25 14.5 8.25H3.5C3.08579 8.25 2.75 7.91421 2.75 7.5V4.5C2.75 4.08579 3.08579 3.75 3.5 3.75Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M3.5 11.75H7.5C7.91421 11.75 8.25 12.0858 8.25 12.5V15.5C8.25 15.9142 7.91421 16.25 7.5 16.25H3.5C3.08579 16.25 2.75 15.9142 2.75 15.5V12.5C2.75 12.0858 3.08579 11.75 3.5 11.75Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M11.5 3.75H14.5C14.9142 3.75 15.25 4.08579 15.25 4.5V7.5C15.25 7.91421 14.9142 8.25 14.5 8.25H11.5C11.0858 8.25 10.75 7.91421 10.75 7.5V4.5C10.75 4.08579 11.0858 3.75 11.5 3.75Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M13.5 12V16M11.5 14H15.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default LibraryAddIcon
