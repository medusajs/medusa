import React from "react"
import IconProps from "./types/icon-type"

const EditIcon: React.FC<IconProps> = ({
  size = "24px",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M9 3H4.55556C4.143 3 3.74733 3.16389 3.45561 3.45561C3.16389 3.74733 3 4.143 3 4.55556V15.4444C3 15.857 3.16389 16.2527 3.45561 16.5444C3.74733 16.8361 4.143 17 4.55556 17H15.4444C15.857 17 16.2527 16.8361 16.5444 16.5444C16.8361 16.2527 17 15.857 17 15.4444V11"
        stroke={color}
        strokeWidth="1.4667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4356 3.43999C14.7173 3.15827 15.0994 3 15.4978 3C15.8962 3 16.2783 3.15827 16.56 3.43999C16.8417 3.72171 17 4.1038 17 4.50221C17 4.90062 16.8417 5.28272 16.56 5.56443L9.8326 12.2919L7 13L7.70815 10.1674L14.4356 3.43999Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default EditIcon
