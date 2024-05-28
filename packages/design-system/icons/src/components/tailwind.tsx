import * as React from "react"
import type { IconProps } from "../types"
const Tailwind = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        fill="none"
        ref={ref}
        {...props}
      >
        <g clipPath="url(#a)">
          <path
            fill="#38BDF8"
            fillRule="evenodd"
            d="M7.5 3q-3 0-3.75 3 1.125-1.5 2.625-1.125c.57.143.978.557 1.43 1.015.735.746 1.586 1.61 3.445 1.61q3 0 3.75-3-1.125 1.5-2.625 1.125c-.57-.143-.978-.557-1.43-1.015C10.21 3.864 9.36 3 7.5 3M3.75 7.5q-3 0-3.75 3Q1.125 9 2.625 9.375c.57.143.978.557 1.43 1.015C4.79 11.136 5.64 12 7.5 12q3 0 3.75-3-1.125 1.5-2.625 1.125c-.57-.143-.978-.557-1.43-1.015C6.46 8.364 5.61 7.5 3.75 7.5"
            clipRule="evenodd"
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
Tailwind.displayName = "Tailwind"
export default Tailwind
