import * as React from "react"
import type { IconProps } from "../types"
const Pencil = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m14.052 3.74 1.405-1.408a1.563 1.563 0 0 1 2.21 2.21L5.694 16.517a3.75 3.75 0 0 1-1.58.941l-2.238.667.667-2.238a3.75 3.75 0 0 1 .941-1.58l10.57-10.568h-.001Zm0 0 2.198 2.197"
        />
      </svg>
    )
  }
)
Pencil.displayName = "Pencil"
export default Pencil
