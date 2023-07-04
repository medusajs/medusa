import React from "react"
import IconProps from "../types/icon-type"

const MedusaVice: React.FC<IconProps> = ({
  size = "96",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M75.6103 20.9859L57.5892 10.5638C51.6929 7.14539 44.4678 7.14539 38.5715 10.5638L20.4673 20.9859C14.6541 24.4044 11 30.741 11 37.4945V58.4221C11 65.259 14.6541 71.5122 20.4673 74.9307L38.4884 85.4362C44.3848 88.8546 51.6098 88.8546 57.5061 85.4362L75.5273 74.9307C81.4236 71.5122 84.9946 65.259 84.9946 58.4221V37.4945C85.1607 30.741 81.5066 24.4044 75.6103 20.9859ZM48.0388 66.593C37.8241 66.593 29.5194 58.2553 29.5194 48C29.5194 37.7447 37.8241 29.407 48.0388 29.407C58.2535 29.407 66.6413 37.7447 66.6413 48C66.6413 58.2553 58.3366 66.593 48.0388 66.593Z"
        fill="url(#paint0_linear_2823_15237)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2823_15237"
          x1="11"
          y1="88"
          x2="100.328"
          y2="63.1913"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7C53FF" />
          <stop offset="1" stopColor="#F796FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default MedusaVice
