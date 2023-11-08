import * as React from "react"
import type { IconProps } from "../types"
const BuildingTax = React.forwardRef<SVGSVGElement, IconProps>(
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
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17.5 7.5h-15V5.833L10 2.5l7.5 3.333V7.5Z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.333 16.667H2.5l.73-2.5h5.103"
        />
        <path
          stroke={color}
          strokeWidth={1.5}
          d="M4.167 7.5v6.667m3.333 0V7.5"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m17.135 11.198-5.104 5.104M12.292 12.083a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25ZM16.875 16.667a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25Z"
        />
      </svg>
    )
  }
)
BuildingTax.displayName = "BuildingTax"
export default BuildingTax
