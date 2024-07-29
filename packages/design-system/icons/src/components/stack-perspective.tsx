import * as React from "react"
import type { IconProps } from "../types"
const StackPerspective = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m2.389 10.389-.748.25a.444.444 0 0 1-.585-.422V4.783c0-.303.297-.517.585-.421l.748.25M5.944 12.055l-.718.3a.445.445 0 0 1-.615-.41v-8.89c0-.317.323-.532.615-.41l.718.3M8.798 1.124l4.631 2.137c.315.145.516.46.516.807v6.862a.89.89 0 0 1-.516.807l-4.631 2.137a.445.445 0 0 1-.631-.403V1.528c0-.325.336-.54.63-.404"
        />
      </svg>
    )
  }
)
StackPerspective.displayName = "StackPerspective"
export default StackPerspective
