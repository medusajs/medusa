import * as React from "react"
import type { IconProps } from "../types"
const Facebook = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          fill="url(#a)"
          fillRule="evenodd"
          d="M1 10c0 4.455 3.24 8.145 7.515 8.91l.053-.044-.008-.001V12.52H6.31V10h2.25V8.02c0-2.25 1.44-3.51 3.51-3.51.63 0 1.35.09 1.98.18v2.295h-1.17c-1.08 0-1.35.54-1.35 1.26V10h2.385l-.405 2.52h-1.98v6.345l-.082.015.037.03C15.76 18.145 19 14.455 19 10c0-4.95-4.05-9-9-9s-9 4.05-9 9Z"
          clipRule="evenodd"
        />
        <defs>
          <linearGradient
            id="a"
            x1={10}
            x2={10}
            y1={18.374}
            y2={0.997}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0062E0" />
            <stop offset={1} stopColor="#19AFFF" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
)
Facebook.displayName = "Facebook"
export default Facebook
