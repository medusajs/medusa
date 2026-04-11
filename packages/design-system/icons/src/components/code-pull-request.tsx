import * as React from "react"
import type { IconProps } from "../types"
const CodePullRequest = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.167 10.389V4.61c0-.982-.796-1.778-1.778-1.778H7.278"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="m9.278 4.833-2-2 2-2M2.833 4.61v5.779M12.167 13.944a1.778 1.778 0 1 0 0-3.555 1.778 1.778 0 0 0 0 3.555M2.833 13.944a1.778 1.778 0 1 0 0-3.555 1.778 1.778 0 0 0 0 3.555M2.833 4.61a1.778 1.778 0 1 0 0-3.555 1.778 1.778 0 0 0 0 3.556"
        />
      </svg>
    )
  }
)
CodePullRequest.displayName = "CodePullRequest"
export default CodePullRequest
