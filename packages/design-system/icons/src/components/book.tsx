import * as React from "react"
import type { IconProps } from "../types"
const Book = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.611 1.056v9.777M1.944 12.389V2.833c0-.982.796-1.777 1.778-1.777h9.334v9.777"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.167 13.945H3.5a1.556 1.556 0 1 1 0-3.111h9.556c-.57.75-.653 2.264 0 3.11zM7.278 4.167h3.11M7.278 6.834h3.11"
        />
      </svg>
    )
  }
)
Book.displayName = "Book"
export default Book
