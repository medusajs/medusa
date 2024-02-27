import * as React from "react"
import type { IconProps } from "../types"
const InformationCircle = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m9.375 9.375.034-.017a.625.625 0 0 1 .886.71l-.59 2.364a.625.625 0 0 0 .886.71l.034-.017M17.5 10a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0ZM10 6.875h.007v.007H10v-.007Z"
        />
      </svg>
    )
  }
)
InformationCircle.displayName = "InformationCircle"
export default InformationCircle
