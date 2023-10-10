import * as React from "react"
import type { IconProps } from "../types"
const ChatBubbleLeftRight = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M16.875 7.093c.737.236 1.25.94 1.25 1.747v3.572c0 .946-.706 1.75-1.65 1.827-.283.023-.567.043-.85.06v2.576l-2.5-2.5a41.25 41.25 0 0 1-3.35-.136 1.763 1.763 0 0 1-.688-.202m7.788-6.945a1.772 1.772 0 0 0-.397-.079 40.532 40.532 0 0 0-6.706 0c-.943.079-1.647.881-1.647 1.827v3.572c0 .697.383 1.316.963 1.625m7.787-6.945V5.532c0-1.351-.96-2.522-2.3-2.696a40.378 40.378 0 0 0-10.4 0c-1.34.174-2.3 1.345-2.3 2.696v5.188c0 1.351.96 2.522 2.3 2.696.48.063.964.117 1.45.162V17.5l3.463-3.463"
        />
      </svg>
    )
  }
)
ChatBubbleLeftRight.displayName = "ChatBubbleLeftRight"
export default ChatBubbleLeftRight
