import * as React from "react"
import type { IconProps } from "../types"
const CursorArrowRays = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m12.535 18.06-1.132-4.227m0 0-2.091 1.854.474-7.891 4.356 6.597-2.739-.56ZM10 1.875V3.75m4.862.138-1.326 1.326m3.339 3.536H15m-8.536 3.536L5.14 13.61M5 8.75H3.125m3.34-3.536L5.138 3.89"
        />
      </svg>
    )
  }
)
CursorArrowRays.displayName = "CursorArrowRays"
export default CursorArrowRays
