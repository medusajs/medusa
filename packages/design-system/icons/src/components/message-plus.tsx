import * as React from "react"
import type { IconProps } from "../types"
const MessagePlus = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11.722 9.5v4.444M13.944 11.722H9.5M13.944 8.057v-4.78c0-.98-.795-1.777-1.777-1.777H2.833c-.982 0-1.777.796-1.777 1.778V9.5c0 .981.795 1.778 1.777 1.778h1.778v2.666l2.26-1.808"
        />
      </svg>
    )
  }
)
MessagePlus.displayName = "MessagePlus"
export default MessagePlus
