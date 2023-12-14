import * as React from "react"
import type { IconProps } from "../types"
const Gift = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M16.815 9.7v6.6c0 .318-.125.623-.347.848a1.178 1.178 0 0 1-.838.352H4.37c-.314 0-.615-.126-.838-.352a1.207 1.207 0 0 1-.347-.848V9.7m6.519-5.1c0-.415-.122-.821-.35-1.167a2.08 2.08 0 0 0-.93-.773 2.05 2.05 0 0 0-2.261.455 2.124 2.124 0 0 0-.45 2.289c.157.383.423.711.764.942.341.23.742.354 1.153.354h2.074m0-2.1v2.1m0-2.1c0-.415.121-.821.35-1.167a2.08 2.08 0 0 1 .93-.773 2.05 2.05 0 0 1 2.26.455 2.124 2.124 0 0 1 .45 2.289 2.095 2.095 0 0 1-.764.942c-.341.23-.742.354-1.152.354H9.704m0 0v10.8M2.889 9.7H17.11c.49 0 .889-.403.889-.9V7.6c0-.497-.398-.9-.889-.9H2.89A.895.895 0 0 0 2 7.6v1.2c0 .497.398.9.889.9Z"
        />
      </svg>
    )
  }
)
Gift.displayName = "Gift"
export default Gift
