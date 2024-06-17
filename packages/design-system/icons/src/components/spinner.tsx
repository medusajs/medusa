import * as React from "react"
import type { IconProps } from "../types"
const Spinner = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M7.667 1.056v2.222" />
          <path d="m12.224 2.943-1.572 1.571" opacity={0.88} />
          <path d="M14.111 7.5H11.89" opacity={0.75} />
          <path d="m12.224 12.057-1.572-1.571" opacity={0.63} />
          <path d="M7.667 13.945v-2.223" opacity={0.5} />
          <path d="m3.11 12.057 1.57-1.571" opacity={0.38} />
          <path d="M1.222 7.5h2.222" opacity={0.25} />
          <path d="m3.11 2.943 1.57 1.571" opacity={0.13} />
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
Spinner.displayName = "Spinner"
export default Spinner
