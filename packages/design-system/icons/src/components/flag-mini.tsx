import * as React from "react"
import type { IconProps } from "../types"
const FlagMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m4.886 11.667.633-6.97a.4.4 0 0 1 .399-.364h9.196a.4.4 0 0 1 .399.437l-.594 6.533a.4.4 0 0 1-.399.364H4.886Zm0 0-.4 4M7.552 6.667l4.667 2.667"
        />
      </svg>
    )
  }
)
FlagMini.displayName = "FlagMini"
export default FlagMini
