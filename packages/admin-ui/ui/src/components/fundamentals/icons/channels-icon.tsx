import React from "react"

import IconProps from "./types/icon-type"

const ChannelsIcon: React.FC<IconProps> = ({
  size = "24px",
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
        d="M17.6627 7.05C18.7811 7.05 19.6877 6.14338 19.6877 5.025C19.6877 3.90662 18.7811 3 17.6627 3C16.5443 3 15.6377 3.90662 15.6377 5.025C15.6377 6.14338 16.5443 7.05 17.6627 7.05Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.6627 14.025C18.7811 14.025 19.6877 13.1184 19.6877 12C19.6877 10.8816 18.7811 9.97498 17.6627 9.97498C16.5443 9.97498 15.6377 10.8816 15.6377 12C15.6377 13.1184 16.5443 14.025 17.6627 14.025Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5123 14.025C6.63068 14.025 7.5373 13.1184 7.5373 12C7.5373 10.8816 6.63068 9.97498 5.5123 9.97498C4.39393 9.97498 3.4873 10.8816 3.4873 12C3.4873 13.1184 4.39393 14.025 5.5123 14.025Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.6627 21C18.7811 21 19.6877 20.0933 19.6877 18.975C19.6877 17.8566 18.7811 16.95 17.6627 16.95C16.5443 16.95 15.6377 17.8566 15.6377 18.975C15.6377 20.0933 16.5443 21 17.6627 21Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6369 5.02502H13.3869C12.3924 5.02502 11.5869 5.83052 11.5869 6.82502V17.175C11.5869 18.1695 12.3924 18.975 13.3869 18.975H15.6369"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6361 12H7.53613"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ChannelsIcon
