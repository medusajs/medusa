import * as React from "react"
import type { IconProps } from "../types"
const SwatchSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fillRule="evenodd"
          d="M1 2.25C1 1.56 1.56 1 2.25 1h3.5C6.44 1 7 1.56 7 2.25V11a3 3 0 1 1-6 0zm3 9.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"
          clipRule="evenodd"
        />
        <path
          fill={color}
          d="M6.646 14h6.104c.69 0 1.25-.56 1.25-1.25v-3.5C14 8.56 13.44 8 12.75 8h-.093l-5.828 5.829q-.09.089-.183.17m1.346-2.75 4.316-4.316a1.25 1.25 0 0 0 0-1.767L9.833 2.69a1.25 1.25 0 0 0-1.767 0l-.067.066V11q0 .126-.006.25z"
        />
      </svg>
    )
  }
)
SwatchSolid.displayName = "SwatchSolid"
export default SwatchSolid
