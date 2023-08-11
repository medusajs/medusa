import React from "react"
import IconProps from "../types/icon-type"

const CoinsIcon: React.FC<IconProps> = ({
  size = "24",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M8.39844 13.2534C11.1599 13.2534 13.3984 11.0148 13.3984 8.25336C13.3984 5.49193 11.1599 3.25336 8.39844 3.25336C5.63701 3.25336 3.39844 5.49193 3.39844 8.25336C3.39844 11.0148 5.63701 13.2534 8.39844 13.2534Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.187 11.7466C18.8282 12.1161 19.3757 12.6281 19.7872 13.2431C20.1987 13.8582 20.4631 14.5596 20.56 15.2932C20.6569 16.0268 20.5837 16.7729 20.346 17.4737C20.1083 18.1744 19.7125 18.8111 19.1892 19.3343C18.666 19.8576 18.0293 20.2534 17.3286 20.4911C16.6278 20.7288 15.8818 20.802 15.1481 20.7051C14.4145 20.6082 13.7131 20.3438 13.0981 19.9323C12.4831 19.5208 11.971 18.9733 11.6016 18.3321"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.39844 6.75336H8.39844V9.75336"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.9874 13.6536L16.5964 14.2129L14.1602 16.4501"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CoinsIcon
