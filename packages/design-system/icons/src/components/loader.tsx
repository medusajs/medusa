import * as React from "react"
import type { IconProps } from "../types"
const Loader = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="m2.943 2.943 1.571 1.571" />
          <path d="M1.055 7.5h2.223" opacity={0.88} />
          <path d="m2.943 12.057 1.571-1.572" opacity={0.75} />
          <path d="M7.5 13.945v-2.222" opacity={0.63} />
          <path d="m12.057 12.057-1.572-1.571" opacity={0.5} />
          <path d="M13.945 7.5h-2.222" opacity={0.38} />
          <path d="m12.057 2.943-1.572 1.571" opacity={0.25} />
          <path d="M7.5 1.055v2.222" opacity={0.13} />
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
Loader.displayName = "Loader"
export default Loader
