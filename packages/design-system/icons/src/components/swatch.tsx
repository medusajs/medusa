import * as React from "react"
import type { IconProps } from "../types"
const Swatch = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.415 16.585a3.124 3.124 0 0 0 2.21.916m-2.21-.916a3.126 3.126 0 0 0 2.21.916m-2.21-.916a3.125 3.125 0 0 1-.915-2.21V3.437c0-.517.42-.937.938-.937h4.374c.518 0 .938.42.938.938V6.83M5.625 17.5a3.125 3.125 0 0 0 2.21-.916m-2.21.916c.829 0 1.624-.33 2.21-.916m-2.21.916 10.938-.001c.517 0 .937-.42.937-.938v-4.375a.938.938 0 0 0-.938-.937H13.17m-5.334 5.335 5.334-5.335m-5.334 5.335a3.125 3.125 0 0 0 .915-2.21V6.831m4.42 4.419 2.398-2.4a.935.935 0 0 0 0-1.325l-3.093-3.094a.937.937 0 0 0-1.325 0l-2.4 2.4m-3.125 7.544h.007v.007h-.007v-.007Z"
        />
      </svg>
    )
  }
)
Swatch.displayName = "Swatch"
export default Swatch
