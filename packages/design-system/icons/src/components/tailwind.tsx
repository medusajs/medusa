import * as React from "react"
import type { IconProps } from "../types"
const Tailwind = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
        <mask
          id="a"
          width={18}
          height={12}
          x={1}
          y={4}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: "luminance",
          }}
        >
          <path fill="#fff" d="M1 4.6h18v10.8H1V4.6Z" />
        </mask>
        <g mask="url(#a)">
          <path
            fill="#38BDF8"
            fillRule="evenodd"
            d="M10 4.6c-2.4 0-3.9 1.2-4.5 3.6.9-1.2 1.95-1.65 3.15-1.35.685.171 1.174.668 1.716 1.218C11.248 8.963 12.269 10 14.5 10c2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.685-.17-1.174-.668-1.716-1.218C13.252 5.637 12.231 4.6 10 4.6ZM5.5 10c-2.4 0-3.9 1.2-4.5 3.6.9-1.2 1.95-1.65 3.15-1.35.685.171 1.174.668 1.716 1.218.882.895 1.903 1.932 4.134 1.932 2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.685-.17-1.174-.668-1.716-1.218C8.752 11.037 7.731 10 5.5 10Z"
            clipRule="evenodd"
          />
        </g>
      </svg>
    )
  }
)
Tailwind.displayName = "Tailwind"
export default Tailwind
