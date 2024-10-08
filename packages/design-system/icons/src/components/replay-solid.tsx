import * as React from "react"
import type { IconProps } from "../types"
const ReplaySolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.67 2.535a1.34 1.34 0 0 0-1.348-.018L4.445 6.325A1.35 1.35 0 0 0 3.75 7.5c0 .488.266.938.694 1.175l6.879 3.808a1.35 1.35 0 0 0 1.349-.018 1.33 1.33 0 0 0 .662-1.156V3.692c0-.48-.247-.912-.662-1.156zM2.292 1.667a.625.625 0 0 0-.625.625v10.416a.625.625 0 0 0 1.25 0V2.292a.625.625 0 0 0-.625-.625"
        />
      </svg>
    )
  }
)
ReplaySolid.displayName = "ReplaySolid"
export default ReplaySolid
