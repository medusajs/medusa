import * as React from "react"
import type { IconProps } from "../types"
const ChatBubble = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.188 8.125h-.313m3.438 0H10m3.438 0h-.313m-5.938 0a.312.312 0 1 1-.624 0 .312.312 0 0 1 .625 0v0Zm3.125 0a.312.312 0 1 1-.624 0 .312.312 0 0 1 .624 0v0Zm3.126 0a.312.312 0 1 1-.625 0 .312.312 0 0 1 .624 0v0ZM1.874 10.633c0 1.334.936 2.495 2.256 2.69.906.133 1.82.235 2.744.307v3.87l3.487-3.486a.95.95 0 0 1 .648-.276 40.242 40.242 0 0 0 4.858-.415c1.321-.195 2.257-1.356 2.257-2.69V5.618c0-1.336-.936-2.496-2.256-2.69A40.329 40.329 0 0 0 10 2.5c-1.993 0-3.953.146-5.87.428-1.32.194-2.255 1.355-2.255 2.69V10.633Z"
        />
      </svg>
    )
  }
)
ChatBubble.displayName = "ChatBubble"
export default ChatBubble
