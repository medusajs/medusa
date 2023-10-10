import * as React from "react"
import type { IconProps } from "../types"
const GlobeEurope = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m17.41 11.16-.945-.945a1.875 1.875 0 0 1-.35-.487l-.9-1.8a.346.346 0 0 0-.553-.09.69.69 0 0 1-.677.175l-1.06-.302a.742.742 0 0 0-.616 1.33l.49.324a.938.938 0 0 1 .143 1.443l-.167.167a.937.937 0 0 0-.275.663v.342c0 .34-.092.674-.267.965l-1.096 1.826a1.759 1.759 0 0 1-1.508.854.88.88 0 0 1-.879-.88v-.976c0-.766-.467-1.456-1.178-1.74l-.546-.218a1.875 1.875 0 0 1-1.153-2.05l.006-.035c.039-.232.12-.454.242-.656l.075-.125a1.875 1.875 0 0 1 1.975-.873l.982.196a.938.938 0 0 0 1.085-.662l.173-.608a.937.937 0 0 0-.482-1.096l-.554-.277-.076.076a1.875 1.875 0 0 1-1.326.55h-.15a.784.784 0 0 0-.551.227.776.776 0 0 1-1.215-.947l1.175-1.96c.118-.196.198-.41.239-.634m9.94 8.224A7.499 7.499 0 1 0 2.594 8.834a7.499 7.499 0 0 0 14.817 2.327Z"
        />
      </svg>
    )
  }
)
GlobeEurope.displayName = "GlobeEurope"
export default GlobeEurope
