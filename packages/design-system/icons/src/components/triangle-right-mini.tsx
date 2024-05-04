import * as React from "react"
import type { IconProps } from "../types"
const TriangleRightMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5 7.41c0-.163.037-.323.108-.464a.848.848 0 0 1 .293-.334.68.68 0 0 1 .397-.112.693.693 0 0 1 .39.142l3.454 2.59c.11.082.2.195.263.33a1.04 1.04 0 0 1 0 .876.867.867 0 0 1-.263.33l-3.455 2.59a.693.693 0 0 1-.39.141.68.68 0 0 1-.396-.111.85.85 0 0 1-.293-.335c-.07-.14-.108-.3-.108-.464V7.41Z"
        />
      </svg>
    )
  }
)
TriangleRightMini.displayName = "TriangleRightMini"
export default TriangleRightMini
