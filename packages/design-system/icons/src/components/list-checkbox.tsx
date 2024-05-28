import * as React from "react"
import type { IconProps } from "../types"
const ListCheckbox = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.611 4.167h5.333M8.611 10.833h5.333M1.495 4.514l1.208 1.208 3.02-3.926M4.611 9.055H2.39a.89.89 0 0 0-.889.89v2.221c0 .492.398.89.889.89H4.61c.491 0 .889-.398.889-.89V9.945a.89.89 0 0 0-.889-.889"
        />
      </svg>
    )
  }
)
ListCheckbox.displayName = "ListCheckbox"
export default ListCheckbox
