import * as React from "react"
import type { IconProps } from "../types"
const QuestionMark = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.44 5.515c1.17-1.025 3.07-1.025 4.241 0 1.173 1.025 1.173 2.687 0 3.712-.202.179-.43.326-.67.442-.744.36-1.45.999-1.45 1.827v.75m0 3h.008v.008H9.56v-.008Z"
        />
      </svg>
    )
  }
)
QuestionMark.displayName = "QuestionMark"
export default QuestionMark
