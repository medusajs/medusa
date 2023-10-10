import * as React from "react"
import type { IconProps } from "../types"
const BuildingStorefront = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M11.25 17.5v-6.25a.625.625 0 0 1 .625-.625h2.5a.625.625 0 0 1 .625.625v6.25m-3.75 0H1.967m9.283 0H15m0 0h3.033m-1.158 0V7.79a2.499 2.499 0 0 0 .517-3.933l-.991-.99a1.25 1.25 0 0 0-.883-.367H4.482c-.332 0-.65.132-.884.367l-.99.99a2.503 2.503 0 0 0 .517 3.933m0 9.71V7.791a2.5 2.5 0 0 0 3.125-.513 2.494 2.494 0 0 0 1.875.846c.747 0 1.417-.327 1.875-.847a2.494 2.494 0 0 0 1.875.847c.747 0 1.417-.327 1.875-.847a2.5 2.5 0 0 0 3.125.512M5.625 15H8.75a.625.625 0 0 0 .625-.626V11.25a.625.625 0 0 0-.625-.625H5.625A.625.625 0 0 0 5 11.25v3.125c0 .346.28.624.625.624Z"
        />
      </svg>
    )
  }
)
BuildingStorefront.displayName = "BuildingStorefront"
export default BuildingStorefront
