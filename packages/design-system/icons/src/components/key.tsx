import * as React from "react"
import type { IconProps } from "../types"
const Key = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.91 4.761a2.327 2.327 0 0 1 2.327 2.328m2.327 0a4.656 4.656 0 0 1-5.453 4.586c-.437-.075-.9.02-1.213.334l-2.062 2.062H7.091v1.746H5.345v1.745h-2.91v-2.186c0-.463.184-.908.512-1.234L7.989 9.1c.313-.314.409-.776.334-1.213a4.655 4.655 0 1 1 9.241-.798v0Z"
        />
      </svg>
    )
  }
)
Key.displayName = "Key"
export default Key
