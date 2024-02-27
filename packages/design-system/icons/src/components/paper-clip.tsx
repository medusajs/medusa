import * as React from "react"
import type { IconProps } from "../types"
const PaperClip = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m17.084 9.532-6.698 6.688a4.378 4.378 0 0 1-6.188 0 4.366 4.366 0 0 1 0-6.179l6.698-6.688a2.92 2.92 0 0 1 4.98 2.06 2.91 2.91 0 0 1-.855 2.06L8.316 14.16a1.46 1.46 0 0 1-2.49-1.03c0-.386.154-.757.428-1.03L12.44 5.93"
        />
      </svg>
    )
  }
)
PaperClip.displayName = "PaperClip"
export default PaperClip
