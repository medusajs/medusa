import * as React from "react"
import type { IconProps } from "../types"
const Resize = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m13.182 8.94-4.243 4.242M12.303 3.818l-8.485 8.485"
        />
      </svg>
    )
  }
)
Resize.displayName = "Resize"
export default Resize
