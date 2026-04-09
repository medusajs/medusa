import * as React from "react"
import type { IconProps } from "../types"
const ShieldCheck = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.64 2 7.974.507c-.31-.1-.638-.099-.948 0L2.36 2a1.55 1.55 0 0 0-1.081 1.482v5.796c0 3.118 4.396 4.781 5.742 5.217a1.56 1.56 0 0 0 .958 0c1.348-.435 5.744-2.098 5.744-5.216V3.482c0-.68-.434-1.275-1.082-1.482m-2.383 3.902-3.02 4a.67.67 0 0 1-.986.086l-1.43-1.333a.667.667 0 0 1 .908-.976l.89.829 2.574-3.41a.667.667 0 0 1 1.064.804"
        />
      </svg>
    )
  }
)
ShieldCheck.displayName = "ShieldCheck"
export default ShieldCheck
