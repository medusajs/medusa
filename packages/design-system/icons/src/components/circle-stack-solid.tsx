import * as React from "react"
import type { IconProps } from "../types"
const CircleStackSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          d="M7.5.611c-3.092 0-6.222.916-6.222 2.667v8.444c0 1.751 3.13 2.667 6.222 2.667s6.222-.916 6.222-2.667V3.278C13.722 1.527 10.592.61 7.5.61M12.39 7.5c0 .388-1.713 1.333-4.889 1.333S2.611 7.888 2.611 7.5V4.985c1.2.632 3.048.96 4.889.96 1.84 0 3.69-.328 4.889-.96zM7.5 13.056c-3.176 0-4.889-.946-4.889-1.334V9.208c1.2.632 3.048.959 4.889.959 1.84 0 3.69-.327 4.889-.96v2.515c0 .388-1.713 1.334-4.889 1.334"
        />
      </svg>
    )
  }
)
CircleStackSolid.displayName = "CircleStackSolid"
export default CircleStackSolid
