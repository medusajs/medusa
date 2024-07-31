import * as React from "react"
import type { IconProps } from "../types"

const HandTruck = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        fill="none"
        ref={ref}
        {...props}
      >
        <g
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path
            d="M10.6918 3.42715L6.96541 4.49011C6.50807 4.62056 6.24309 5.09706 6.37354 5.5544L7.31839 8.86672C7.44885 9.32405 7.92535 9.58904 8.38269 9.45858L12.109 8.39563C12.5664 8.26517 12.8314 7.78867 12.7009 7.33133L11.7561 4.01901C11.6256 3.56168 11.1491 3.29669 10.6918 3.42715Z"
            stroke="#52525B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.82837 3.95886L9.30112 5.61478"
            stroke="#52525B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.37573 12.2083L14.6736 10.127"
            stroke="#52525B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.43299 10.8572L3.26988 3.24407C3.16482 2.87379 2.8264 2.61804 2.44149 2.61804H1.54163"
            stroke="#52525B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.84728 13.8125C6.67954 13.8125 7.35422 13.1378 7.35422 12.3055C7.35422 11.4733 6.67954 10.7986 5.84728 10.7986C5.01501 10.7986 4.34033 11.4733 4.34033 12.3055C4.34033 13.1378 5.01501 13.8125 5.84728 13.8125Z"
            stroke="#52525B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
HandTruck.displayName = "HandTruck"
export default HandTruck
