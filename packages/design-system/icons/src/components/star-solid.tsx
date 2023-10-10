import * as React from "react"
import type { IconProps } from "../types"
const StarSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          fillRule="evenodd"
          d="M8.99 2.675c.373-.898 1.647-.898 2.02 0l1.735 4.172 4.503.361c.97.078 1.364 1.288.624 1.921l-3.43 2.94 1.047 4.393c.226.947-.803 1.695-1.633 1.188L10 15.295 6.144 17.65c-.83.507-1.859-.242-1.633-1.188l1.047-4.394-3.43-2.939c-.74-.633-.346-1.843.624-1.92l4.503-.362L8.99 2.676v-.001Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
StarSolid.displayName = "StarSolid"
export default StarSolid
