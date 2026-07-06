import * as React from "react"
import type { IconProps } from "../types"
const Spinner = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
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
          <path d="M3.11 2.943 4.68 4.514" />
          <path d="M1.222 7.5h2.222" opacity={0.88} />
          <path d="m3.11 12.057 1.571-1.571" opacity={0.75} />
          <path d="M7.667 13.945v-2.222" opacity={0.63} />
          <path d="m12.224 12.057-1.572-1.571" opacity={0.5} />
          <path d="M14.112 7.5h-2.223" opacity={0.38} />
          <path d="m12.224 2.943-1.572 1.571" opacity={0.25} />
          <path d="M7.667 1.055v2.223" opacity={0.13} />
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
