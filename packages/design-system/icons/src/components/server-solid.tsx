import * as React from "react"
import type { IconProps } from "../types"
const ServerSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color} clipPath="url(#a)">
          <path d="m14.497 8.835-1.96-5.885a2.44 2.44 0 0 0-2.319-1.672H4.782a2.44 2.44 0 0 0-2.32 1.672L.505 8.835s-.115.39-.115.665v1.778c0 1.103.897 2 2 2H12.61c1.103 0 2-.897 2-2V9.5c0-.342-.115-.665-.115-.665m-1.22 2.443a.667.667 0 0 1-.666.666H2.39a.667.667 0 0 1-.667-.666V9.5c0-.368.299-.667.667-.667H12.61c.368 0 .667.299.667.667z" />
          <path d="M5.722 9.722H3.278a.667.667 0 0 0 0 1.334h2.444a.667.667 0 0 0 0-1.334" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
ServerSolid.displayName = "ServerSolid"
export default ServerSolid
