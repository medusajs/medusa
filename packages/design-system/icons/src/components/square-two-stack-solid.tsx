import * as React from "react"
import type { IconProps } from "../types"
const SquareTwoStackSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.167 4.833h-2v-2c0-.857-.698-1.555-1.556-1.555H2.833c-.857 0-1.555.698-1.555 1.555v5.778c0 .858.698 1.556 1.555 1.556h2v2c0 .857.698 1.555 1.556 1.555h5.778c.857 0 1.555-.697 1.555-1.555V6.389c0-.858-.697-1.556-1.555-1.556"
        />
      </svg>
    )
  }
)
SquareTwoStackSolid.displayName = "SquareTwoStackSolid"
export default SquareTwoStackSolid
