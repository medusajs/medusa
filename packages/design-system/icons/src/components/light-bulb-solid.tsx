import * as React from "react"
import type { IconProps } from "../types"
const LightBulbSolid = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          fill={color}
          d="M10.722 1.532A5.15 5.15 0 0 0 6.406.502C4.426.917 2.848 2.536 2.48 4.53c-.395 2.133.544 4.222 2.354 5.326v2.31a2.447 2.447 0 0 0 2.445 2.445h.444a2.447 2.447 0 0 0 2.445-2.444v-2.31A5.08 5.08 0 0 0 12.612 5.5a5.1 5.1 0 0 0-1.889-3.968m-3 11.746h-.444a1.113 1.113 0 0 1-1.111-1.111v-1.111h2.666v1.11c0 .613-.498 1.112-1.11 1.112"
        />
      </svg>
    )
  }
)
LightBulbSolid.displayName = "LightBulbSolid"
export default LightBulbSolid
