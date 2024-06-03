import * as React from "react"
import type { IconProps } from "../types"
const LightBulbSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10.722 1.532A5.15 5.15 0 0 0 6.406.502C4.426.917 2.848 2.536 2.48 4.53c-.395 2.133.544 4.222 2.354 5.326v2.31a2.447 2.447 0 0 0 2.445 2.445h.444a2.447 2.447 0 0 0 2.445-2.444v-2.31A5.08 5.08 0 0 0 12.612 5.5a5.1 5.1 0 0 0-1.889-3.968m-3 11.746h-.444c-.534 0-.96-.386-1.066-.89h2.577c-.106.504-.533.89-1.066.89m1.111-2.222H6.167v-.89h2.666zm.916-5.53L8.167 7.11v1.057a.667.667 0 0 1-1.334 0V7.109L5.251 5.527a.667.667 0 1 1 .943-.943L7.501 5.89l1.307-1.306a.667.667 0 1 1 .943.943z"
        />
      </svg>
    )
  }
)
LightBulbSolid.displayName = "LightBulbSolid"
export default LightBulbSolid
