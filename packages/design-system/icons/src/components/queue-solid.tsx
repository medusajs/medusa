import * as React from "react"
import type { IconProps } from "../types"
const QueueSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.167 1.278H2.833c-.859 0-1.555.696-1.555 1.555v3.111c0 .86.696 1.556 1.555 1.556h9.334c.859 0 1.555-.696 1.555-1.556v-3.11c0-.86-.696-1.556-1.555-1.556M13.056 9.278H1.945a.667.667 0 0 0 0 1.333h11.11a.667.667 0 0 0 0-1.333M13.056 12.389H1.945a.667.667 0 0 0 0 1.333h11.11a.667.667 0 0 0 0-1.333"
        />
      </svg>
    )
  }
)
QueueSolid.displayName = "QueueSolid"
export default QueueSolid
