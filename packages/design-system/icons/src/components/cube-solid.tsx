import * as React from "react"
import type { IconProps } from "../types"
const CubeSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10.346 1.634a.717.717 0 0 0-.692 0l-6.8 3.751L10 9.328l7.146-3.943-6.8-3.751Zm7.3 5.113-6.93 3.823v7.885l6.56-3.618a.717.717 0 0 0 .37-.628V6.747ZM9.283 18.455V10.57l-6.93-3.823v7.462a.717.717 0 0 0 .372.628l6.558 3.618Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
CubeSolid.displayName = "CubeSolid"
export default CubeSolid
