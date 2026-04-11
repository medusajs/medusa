import * as React from "react"
import type { IconProps } from "../types"
const Plug = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m4.037 7.246 3.717 3.717a.89.89 0 0 1 0 1.257l-.249.25a3.518 3.518 0 0 1-4.974-4.975l.249-.249a.89.89 0 0 1 1.257 0M1.056 13.944 2.53 12.47M4.784 7.993l1.383-1.382M7.007 10.215l1.382-1.382M7.246 4.037l3.717 3.717a.89.89 0 0 0 1.257 0l.249-.249a3.518 3.518 0 0 0-4.974-4.974l-.25.249a.89.89 0 0 0 0 1.257M13.945 1.056 12.47 2.53"
        />
      </svg>
    )
  }
)
Plug.displayName = "Plug"
export default Plug
