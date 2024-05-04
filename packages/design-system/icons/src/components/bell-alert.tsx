import * as React from "react"
import type { IconProps } from "../types"
const BellAlert = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.38 14.235a19.872 19.872 0 0 0 4.546-1.092A7.472 7.472 0 0 1 15 8.125V7.5a5 5 0 0 0-10 0v.625a7.472 7.472 0 0 1-1.927 5.018c1.445.534 2.967.904 4.546 1.092m4.762 0c-1.582.188-3.18.188-4.762 0m4.762 0a2.5 2.5 0 1 1-4.762 0M2.603 6.25A7.474 7.474 0 0 1 4.41 2.5m11.18 0a7.474 7.474 0 0 1 1.807 3.75"
        />
      </svg>
    )
  }
)
BellAlert.displayName = "BellAlert"
export default BellAlert
