import * as React from "react"
import type { IconProps } from "../types"
const TriangleLeftMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M10 10.09c0 .163-.037.323-.108.463a.85.85 0 0 1-.293.335.7.7 0 0 1-.397.111.7.7 0 0 1-.39-.141l-3.454-2.59a.9.9 0 0 1-.263-.33 1.04 1.04 0 0 1 0-.876.9.9 0 0 1 .263-.33l3.455-2.59A.7.7 0 0 1 9.203 4a.7.7 0 0 1 .396.112.85.85 0 0 1 .293.335c.07.14.108.3.108.463z"
        />
      </svg>
    )
  }
)
TriangleLeftMini.displayName = "TriangleLeftMini"
export default TriangleLeftMini
