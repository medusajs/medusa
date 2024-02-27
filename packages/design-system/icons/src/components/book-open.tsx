import * as React from "react"
import type { IconProps } from "../types"
const BookOpen = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10 5.035a7.473 7.473 0 0 0-5-1.91 7.48 7.48 0 0 0-2.5.427v11.875A7.49 7.49 0 0 1 5 15c1.92 0 3.673.723 5 1.91m0-11.875a7.472 7.472 0 0 1 5-1.91c.877 0 1.718.15 2.5.427v11.875A7.49 7.49 0 0 0 15 15a7.473 7.473 0 0 0-5 1.91m0-11.875V16.91"
        />
      </svg>
    )
  }
)
BookOpen.displayName = "BookOpen"
export default BookOpen
