import * as React from "react"
import type { IconProps } from "../types"
const BuildingsSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fillRule="evenodd"
          d="M13.893 4.154v3.121h2.347A1.524 1.524 0 0 1 17.764 8.8v6.992h.024a.75.75 0 0 1 0 1.5H2.303a.75.75 0 0 1 0-1.5h.024V4.154A1.524 1.524 0 0 1 3.852 2.63h8.516a1.524 1.524 0 0 1 1.525 1.524Zm-3.654 11.732a.65.65 0 0 1-.65-.65V13.86H6.631v1.377a.65.65 0 1 1-1.3 0V13.21a.65.65 0 0 1 .65-.65h4.258a.65.65 0 0 1 .65.65v2.027a.65.65 0 0 1-.65.65ZM5.981 9.211a.75.75 0 1 0 0 1.5h4.258a.75.75 0 1 0 0-1.5H5.981Zm9.48 6.673a.75.75 0 0 1-.75-.75V9.961a.75.75 0 0 1 1.5 0v5.173a.75.75 0 0 1-.75.75Zm-9.48-9.982a.75.75 0 0 0 0 1.5h4.258a.75.75 0 0 0 0-1.5H5.981Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
BuildingsSolid.displayName = "BuildingsSolid"
export default BuildingsSolid
