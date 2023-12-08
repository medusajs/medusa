import * as React from "react"
import type { IconProps } from "../types"
const QuestionMarkCircle = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8.232 6.266c.976-.854 2.56-.854 3.536 0s.976 2.239 0 3.093c-.17.15-.359.272-.559.368-.62.301-1.208.833-1.208 1.523v.625M17.5 10a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0ZM10 14.375h.007v.007H10v-.007Z"
        />
      </svg>
    )
  }
)
QuestionMarkCircle.displayName = "QuestionMarkCircle"
export default QuestionMarkCircle
