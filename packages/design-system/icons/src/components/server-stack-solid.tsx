import * as React from "react"
import type { IconProps } from "../types"
const ServerStackSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.59 3.373A2.5 2.5 0 0 1 6.487 2.5h7.024a2.5 2.5 0 0 1 1.899.873l1.435 1.674A3.776 3.776 0 0 0 16.25 5H3.75c-.202 0-.402.017-.596.047L4.59 3.373Z"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="M1.25 8.75a2.5 2.5 0 0 1 2.5-2.5h12.5a2.5 2.5 0 0 1 0 5H3.75a2.5 2.5 0 0 1-2.5-2.5Zm12.5 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm1.875.625a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25ZM3.75 12.5a2.5 2.5 0 0 0 0 5h12.5a2.5 2.5 0 0 0 0-5H3.75Zm9.375 3.125a.624.624 0 1 0 0-1.249.624.624 0 0 0 0 1.249ZM16.25 15a.624.624 0 1 1-1.249 0 .624.624 0 0 1 1.249 0Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
ServerStackSolid.displayName = "ServerStackSolid"
export default ServerStackSolid
