import * as React from "react"
import type { IconProps } from "../types"
const ThumbUp = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.527 8.75c.672 0 1.278-.372 1.693-.9a7.534 7.534 0 0 1 2.384-2c.603-.32 1.125-.797 1.378-1.43.177-.442.268-.915.268-1.393V2.5a.625.625 0 0 1 .625-.625A1.875 1.875 0 0 1 13.75 3.75c0 .96-.217 1.87-.602 2.682-.222.465.089 1.068.604 1.068h2.605c.855 0 1.62.578 1.711 1.43a9.959 9.959 0 0 1-2.15 7.338c-.324.401-.823.607-1.338.607h-3.347c-.402 0-.803-.065-1.186-.192l-2.595-.866a3.751 3.751 0 0 0-1.185-.192H4.92m0 0c.07.17.144.338.225.502.164.333-.065.748-.436.748h-.756c-.741 0-1.428-.432-1.644-1.14a10 10 0 0 1-.434-2.922c0-1.295.246-2.53.692-3.665.255-.646.905-1.023 1.6-1.023h.877c.394 0 .621.463.417.8a7.465 7.465 0 0 0-1.085 3.887c0 .995.193 1.945.545 2.813H4.92ZM11.875 7.5h1.875"
        />
      </svg>
    )
  }
)
ThumbUp.displayName = "ThumbUp"
export default ThumbUp
