import * as React from "react"
import type { IconProps } from "../types"
const TagSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.603 6.66 8.492 1.55A2.43 2.43 0 0 0 6.764.833H2.389C1.53.833.833 1.531.833 2.39v4.374c0 .653.254 1.267.717 1.729l5.11 5.111a2.44 2.44 0 0 0 1.729.715c.626 0 1.251-.238 1.728-.715l3.486-3.486a2.42 2.42 0 0 0 .716-1.728c0-.653-.254-1.267-.716-1.728m-8.548-.493a1.113 1.113 0 0 1-1.11-1.111c0-.613.498-1.112 1.11-1.112s1.112.5 1.112 1.112-.5 1.11-1.112 1.11"
        />
      </svg>
    )
  }
)
TagSolid.displayName = "TagSolid"
export default TagSolid
