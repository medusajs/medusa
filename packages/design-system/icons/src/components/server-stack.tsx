import * as React from "react"
import type { IconProps } from "../types"
const ServerStack = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.375 11.875h11.25m-11.25 0a2.5 2.5 0 0 1-2.5-2.5m2.5 2.5a2.5 2.5 0 0 0 0 5h11.25a2.5 2.5 0 0 0 0-5m-13.75-2.5a2.5 2.5 0 0 1 2.5-2.5h11.25a2.5 2.5 0 0 1 2.5 2.5m-16.25 0c0-.811.263-1.6.75-2.25L4.781 4.25a2.813 2.813 0 0 1 2.25-1.125h5.938c.885 0 1.719.417 2.25 1.125l2.156 2.875c.487.65.75 1.439.75 2.25m0 0a2.5 2.5 0 0 1-2.5 2.5m0 2.5h.007v.007h-.007v-.007Zm0-5h.007v.007h-.007v-.007Zm-2.5 5h.007v.007h-.007v-.007Zm0-5h.007v.007h-.007v-.007Z"
        />
      </svg>
    )
  }
)
ServerStack.displayName = "ServerStack"
export default ServerStack
