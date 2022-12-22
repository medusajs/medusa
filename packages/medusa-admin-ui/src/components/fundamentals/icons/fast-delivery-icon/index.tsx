import React from "react"
import IconProps from "../types/icon-type"

const FastDeliveryIcon: React.FC<IconProps> = ({
  size = "20",
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
        d="M3.02901 6.12695H2.25439"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.80363 3.8031H2.25439"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8734 16.1969H3.02881"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0861 3.8031L13.3224 6.34927C13.224 6.67693 12.9219 6.90157 12.5803 6.90157H10.1697C9.65067 6.90157 9.27886 6.40117 9.42758 5.90464L10.0581 3.8031"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.90088 10.7745H8.55081"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.2125 13.0985H6.01087C4.76529 13.0985 3.87216 11.8978 4.23003 10.7049L5.9032 5.1277C6.13946 4.34146 6.86295 3.8031 7.68405 3.8031H15.8865C17.1321 3.8031 18.0252 5.00376 17.6673 6.19667L15.9941 11.7739C15.7579 12.5601 15.0336 13.0985 14.2125 13.0985Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default FastDeliveryIcon
