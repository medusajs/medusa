import React from "react"
import IconProps from "../types/icon-type"

const BuildingsIcon: React.FC<IconProps> = ({
  size = "20",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 20 20`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M17.0141 16.5422V8.79964C17.0141 8.5943 16.9325 8.39736 16.7873 8.25216C16.6421 8.10696 16.4452 8.02539 16.2398 8.02539H13.1428"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.07739 16.5422V4.15414C3.07739 3.94879 3.15897 3.75186 3.30417 3.60666C3.44937 3.46146 3.6463 3.37988 3.85165 3.37988H12.3684C12.5738 3.37988 12.7707 3.46146 12.9159 3.60666C13.0611 3.75186 13.1427 3.94879 13.1427 4.15414V16.5422"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.98071 6.6521H10.2391"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.98071 9.96094H10.2391"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.98087 16.5422H10.2393V13.2089H5.98087V16.5422Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.7885 16.5422H2.30347"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default BuildingsIcon
