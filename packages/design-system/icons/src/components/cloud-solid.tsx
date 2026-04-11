import * as React from "react"
import type { IconProps } from "../types"
const CloudSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.084 5.123c-1.355-.535-3.066-.29-4.473.951.222-1.13 2.033-2.569 3.91-2.478-.812-1.388-2.313-2.318-3.995-2.318-2.565 0-4.65 2.093-4.65 4.666q0 .167.014.336a3.33 3.33 0 0 0-1.479 5.627c.622.6 1.434.926 2.28.926h6.934c2.198 0 3.986-1.793 3.986-4a3.98 3.98 0 0 0-2.527-3.71"
        />
      </svg>
    )
  }
)
CloudSolid.displayName = "CloudSolid"
export default CloudSolid
