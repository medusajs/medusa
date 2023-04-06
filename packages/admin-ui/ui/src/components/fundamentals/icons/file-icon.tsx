import { FC } from "react"
import IconProps from "./types/icon-type"

const FileIcon: FC<IconProps> = (props) => {
  const { fill, size, ...attributes } = props
  const line = fill || "#2DD4BF"
  return (
    <svg
      width={size || 20}
      height={size || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M13.333 17.5H14.1663C14.8294 17.5 15.4653 17.2366 15.9341 16.7678C16.4029 16.2989 16.6663 15.663 16.6663 15V7.09109C16.6663 6.42805 16.4029 5.79217 15.9341 5.32333L13.843 3.23223C13.3742 2.76339 12.7383 2.5 12.0752 2.5H5.83301C5.16997 2.5 4.53408 2.76339 4.06524 3.23223C3.5964 3.70107 3.33301 4.33696 3.33301 5V7.5"
        stroke={line}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6663 7.08333H13.7497C13.3076 7.08333 12.8837 6.90774 12.5712 6.59518C12.2586 6.28262 12.083 5.85869 12.083 5.41667V2.5"
        stroke={line}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.99967 10H9.16634C9.60837 10 10.0323 10.1756 10.3449 10.4882C10.6574 10.8007 10.833 11.2246 10.833 11.6667V15.8333C10.833 16.2754 10.6574 16.6993 10.3449 17.0118C10.0323 17.3244 9.60837 17.5 9.16634 17.5H4.99967C4.55765 17.5 4.13372 17.3244 3.82116 17.0118C3.5086 16.6993 3.33301 16.2754 3.33301 15.8333V11.6667C3.33301 11.2246 3.5086 10.8007 3.82116 10.4882C4.13372 10.1756 4.55765 10 4.99967 10V10Z"
        stroke={line}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.833 13.75H3.33301"
        stroke={line}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.08301 10V17.5"
        stroke={line}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default FileIcon
