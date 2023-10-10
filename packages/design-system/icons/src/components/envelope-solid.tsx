import * as React from "react"
import type { IconProps } from "../types"
const EnvelopeSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.625 7.344v6.844a2.393 2.393 0 0 0 2.393 2.392h11.964a2.393 2.393 0 0 0 2.393-2.392V7.344l-7.121 4.381a2.393 2.393 0 0 1-2.508 0L1.625 7.344Z"
        />
        <path
          fill={color}
          d="M18.375 5.938v-.126a2.393 2.393 0 0 0-2.393-2.392H4.018a2.393 2.393 0 0 0-2.393 2.392v.126l7.748 4.769a1.196 1.196 0 0 0 1.254 0l7.748-4.769Z"
        />
      </svg>
    )
  }
)
EnvelopeSolid.displayName = "EnvelopeSolid"
export default EnvelopeSolid
