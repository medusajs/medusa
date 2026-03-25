import * as React from "react"
import type { IconProps } from "../types"
const PointerCircleSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.5.389C3.58.389.389 3.579.389 7.5s3.19 7.111 7.111 7.111 7.111-3.19 7.111-7.111S11.421.389 7.5.389m3.574 7.68-2.277.728-.729 2.275c-.12.38-.47.641-.87.65H7.18a.93.93 0 0 1-.877-.613L4.224 5.423a.92.92 0 0 1 .216-.982.92.92 0 0 1 .982-.217l5.685 2.078a.934.934 0 0 1-.035 1.767z"
        />
      </svg>
    )
  }
)
PointerCircleSolid.displayName = "PointerCircleSolid"
export default PointerCircleSolid
