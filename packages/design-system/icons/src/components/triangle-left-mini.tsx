import * as React from "react"
import type { IconProps } from "../types"
const TriangleLeftMini = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
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
          fill={color}
          d="M12.5 12.59c0 .163-.037.323-.108.463a.848.848 0 0 1-.293.335.68.68 0 0 1-.397.111.692.692 0 0 1-.39-.141l-3.454-2.59a.868.868 0 0 1-.263-.33 1.041 1.041 0 0 1 0-.876.868.868 0 0 1 .263-.33l3.455-2.59a.693.693 0 0 1 .39-.142.68.68 0 0 1 .396.112.849.849 0 0 1 .293.335c.07.14.108.3.108.463v5.18Z"
        />
      </svg>
    )
  }
)
TriangleLeftMini.displayName = "TriangleLeftMini"
export default TriangleLeftMini
