import * as React from "react"
import type { IconProps } from "../types"
const Window = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.5 6.875V15a1.875 1.875 0 0 0 1.875 1.875h11.25A1.875 1.875 0 0 0 17.5 15V6.875m-15 0V5a1.875 1.875 0 0 1 1.875-1.875h11.25A1.875 1.875 0 0 1 17.5 5v1.875m-15 0h15M4.375 5h.007v.007h-.007V5ZM6.25 5h.007v.007H6.25V5Zm1.875 0h.007v.007h-.007V5Z"
        />
      </svg>
    )
  }
)
Window.displayName = "Window"
export default Window
