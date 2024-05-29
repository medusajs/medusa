import * as React from "react"
import type { IconProps } from "../types"
const ChatBubble = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clipPath="url(#a)">
          <path
            fill={color}
            fillRule="evenodd"
            d="M2.833.75A2.53 2.53 0 0 0 .306 3.278V9.5a2.53 2.53 0 0 0 2.527 2.528h1.028v1.916a.75.75 0 0 0 1.219.586l3.128-2.502h3.959A2.53 2.53 0 0 0 14.695 9.5V3.278A2.53 2.53 0 0 0 12.167.75zM1.806 3.278c0-.568.46-1.028 1.027-1.028h9.334c.568 0 1.028.46 1.028 1.028V9.5c0 .567-.46 1.028-1.028 1.028H7.945a.75.75 0 0 0-.469.164l-2.115 1.692v-1.106a.75.75 0 0 0-.75-.75H2.833c-.567 0-1.027-.46-1.027-1.028zm4.805 3.11a.89.89 0 0 0 1.778 0 .89.89 0 0 0-1.778 0m-2.222.89a.89.89 0 0 1 0-1.778.89.89 0 0 1 0 1.778m5.333-.89a.89.89 0 0 0 1.778 0 .89.89 0 0 0-1.778 0"
            clipRule="evenodd"
          />
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
ChatBubble.displayName = "ChatBubble"
export default ChatBubble
