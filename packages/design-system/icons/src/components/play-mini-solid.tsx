import * as React from "react"
import type { IconProps } from "../types"
const PlayMiniSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.926 6.147 4.487 1.475a1.55 1.55 0 0 0-1.555.02c-.478.282-.763.78-.763 1.333v9.344c0 .553.285 1.05.763 1.332.248.146.521.22.796.22.26 0 .52-.067.76-.198l8.436-4.672c.494-.273.8-.792.8-1.353s-.306-1.081-.8-1.354"
        />
      </svg>
    )
  }
)
PlayMiniSolid.displayName = "PlayMiniSolid"
export default PlayMiniSolid
