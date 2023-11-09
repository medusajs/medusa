import * as React from "react"
import type { IconProps } from "../types"
const Spinner = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M14.865 14.865c.437.437.441 1.154-.053 1.526A8 8 0 1 1 9.634 2.008c.618-.028 1.072.527 1.014 1.143-.059.615-.609 1.056-1.224 1.118a5.76 5.76 0 1 0 3.785 10.514c.514-.345 1.219-.355 1.656.082Z"
        />
      </svg>
    )
  }
)
Spinner.displayName = "Spinner"
export default Spinner
