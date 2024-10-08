import * as React from "react"
import type { IconProps } from "../types"
const KlarnaEx = React.forwardRef<SVGSVGElement, IconProps>(
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
        <path
          fill={color}
          fillRule="evenodd"
          d="M14.25 7.5a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0M5.906 4.603H4.658v5.425h1.248zm3.125 0H7.8a3.12 3.12 0 0 1-1.259 2.515l-.48.357 1.869 2.547h1.533l-1.72-2.33a4.3 4.3 0 0 0 1.287-3.09m.797 4.005a.821.821 0 1 1 .912 1.366.821.821 0 0 1-.912-1.366"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
KlarnaEx.displayName = "KlarnaEx"
export default KlarnaEx
