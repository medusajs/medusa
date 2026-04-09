import * as React from "react"
import type { IconProps } from "../types"
const CreditCardRefresh = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M1.056 5.944h12.888M3.278 9.5h2.666M11.849 10.898h2.222V8.676M13.944 5.945V4.61c0-.981-.795-1.777-1.777-1.777H2.833c-.982 0-1.777.796-1.777 1.777v5.778c0 .981.795 1.778 1.777 1.778h3.613"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.404 13.242a2.444 2.444 0 1 1 .5-2.566"
        />
      </svg>
    )
  }
)
CreditCardRefresh.displayName = "CreditCardRefresh"
export default CreditCardRefresh
