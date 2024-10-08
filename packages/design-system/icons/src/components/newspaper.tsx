import * as React from "react"
import type { IconProps } from "../types"
const Newspaper = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M2.611 13.945a1.556 1.556 0 0 1-1.555-1.556V8.611c0-.245.199-.444.444-.444h.444" />
          <path d="M4.167 12.389c0 .859-.697 1.556-1.556 1.556h9.556c.982 0 1.777-.796 1.777-1.778V2.833c0-.982-.795-1.777-1.777-1.777H5.944c-.982 0-1.777.795-1.777 1.777z" />
          <path d="M11.278 3.722H6.833v2.222h4.445zM11.278 8.611H6.833M11.278 11.278H6.833" />
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
Newspaper.displayName = "Newspaper"
export default Newspaper
