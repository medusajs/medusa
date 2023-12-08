import * as React from "react"
import type { IconProps } from "../types"
const TriangleDownMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          fillRule="evenodd"
          d="M13.087 6.25c.693 0 1.133.75.799 1.363l-3.087 5.66a.908.908 0 0 1-1.598 0l-3.087-5.66C5.78 7 6.22 6.25 6.914 6.25h6.173Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
TriangleDownMini.displayName = "TriangleDownMini"
export default TriangleDownMini
