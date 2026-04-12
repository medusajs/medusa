import * as React from "react"
import type { IconProps } from "../types"
const CursorDefaultSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="m2.661 1.218.184.052 10.154 3.71.1.041c.997.458.93 1.936-.147 2.283l-4.28 1.369-1.37 4.28c-.344 1.079-1.824 1.142-2.281.147L4.98 13 1.27 2.845c-.336-.92.48-1.814 1.391-1.627"
        />
      </svg>
    )
  }
)
CursorDefaultSolid.displayName = "CursorDefaultSolid"
export default CursorDefaultSolid
