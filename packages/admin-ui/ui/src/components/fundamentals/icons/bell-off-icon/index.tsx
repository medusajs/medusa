import React from "react"
import IconProps from "../types/icon-type"

const BellOffIcon: React.FC<IconProps> = ({
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
        d="M11.2971 16.7566C11.1653 16.9839 10.976 17.1726 10.7483 17.3037C10.5206 17.4349 10.2624 17.5039 9.99964 17.5039C9.73686 17.5039 9.47869 17.4349 9.25097 17.3037C9.02326 17.1726 8.83401 16.9839 8.70215 16.7566"
        stroke={color}
        strokeWidth="1.49999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9723 10.7567C14.6386 9.53526 14.4795 8.27274 14.4998 7.00671"
        stroke={color}
        strokeWidth="1.49999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.69498 5.7016C5.56468 6.1243 5.49894 6.56426 5.49998 7.00659C5.49998 12.2566 3.25 13.7565 3.25 13.7565H13.7499"
        stroke={color}
        strokeWidth="1.49999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4994 7.00665C14.5006 6.19145 14.2804 5.39124 13.8622 4.69148C13.444 3.99173 12.8435 3.41871 12.125 3.03365C11.4065 2.64859 10.5969 2.46595 9.78261 2.50523C8.96836 2.54451 8.18007 2.80424 7.50195 3.25667"
        stroke={color}
        strokeWidth="1.49999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 2.50665L17.4999 17.5065"
        stroke={color}
        strokeWidth="1.49999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default BellOffIcon
