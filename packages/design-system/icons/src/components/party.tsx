import * as React from "react"
import type { IconProps } from "../types"
const Party = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m2.433 11.549 2.264-7.44a.817.817 0 0 1 1.36-.34l5.176 5.176a.817.817 0 0 1-.34 1.36l-7.441 2.264a.817.817 0 0 1-1.02-1.02zM5.724 11.876 3.95 6.56M8.6 11 6.254 3.967"
        />
        <path
          fill={color}
          d="m13.824 2.185-.773-.257-.258-.773c-.083-.25-.497-.25-.58 0l-.259.773-.772.257a.307.307 0 0 0 0 .582l.772.257.258.773a.306.306 0 0 0 .58 0l.258-.773.773-.257a.307.307 0 0 0 0-.582M10.563 5.05a.613.613 0 1 0 0-1.225.613.613 0 0 0 0 1.225"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.317 2.959c.15-.109.48-.38.672-.856.25-.623.096-1.178.045-1.34M12.042 6.683c.108-.15.38-.48.855-.672a2 2 0 0 1 1.34-.045"
        />
      </svg>
    )
  }
)
Party.displayName = "Party"
export default Party
