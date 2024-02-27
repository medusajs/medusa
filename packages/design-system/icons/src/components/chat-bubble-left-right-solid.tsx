import * as React from "react"
import type { IconProps } from "../types"
const ChatBubbleLeftRightSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.094 2.215a41.058 41.058 0 0 1 10.562 0c1.602.208 2.742 1.55 2.837 3.106a3.67 3.67 0 0 0-.86-.176 42.408 42.408 0 0 0-7.016 0C7.652 5.308 6.25 6.97 6.25 8.84v3.572a3.725 3.725 0 0 0 2.027 3.32l-2.21 2.21A.625.625 0 0 1 5 17.5v-3.358a40.495 40.495 0 0 1-.906-.107c-1.673-.218-2.844-1.674-2.844-3.317V5.532c0-1.642 1.17-3.1 2.844-3.317Z"
        />
        <path
          fill={color}
          d="M13.125 6.25c-1.147 0-2.283.048-3.405.14-1.283.107-2.22 1.196-2.22 2.45v3.572c0 1.255.94 2.345 2.225 2.45 1.036.085 2.083.13 3.14.137l2.318 2.318a.625.625 0 0 0 1.067-.442v-1.992l.275-.021c1.285-.104 2.225-1.194 2.225-2.45V8.84c0-1.254-.938-2.343-2.22-2.45a41.163 41.163 0 0 0-3.405-.14Z"
        />
      </svg>
    )
  }
)
ChatBubbleLeftRightSolid.displayName = "ChatBubbleLeftRightSolid"
export default ChatBubbleLeftRightSolid
