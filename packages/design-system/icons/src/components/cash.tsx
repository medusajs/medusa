import * as React from "react"
import type { IconProps } from "../types"
const Cash = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2 14.967a49.288 49.288 0 0 1 12.962 1.724.94.94 0 0 0 1.192-.9v-.824M3.23 3.275v.615a.615.615 0 0 1-.616.616H2m0 0v-.308c0-.51.414-.923.923-.923H16.77M2 4.505v7.385m14.77-8.615v.615c0 .34.275.616.615.616H18m-1.23-1.231h.307c.51 0 .923.413.923.923v8c0 .51-.413.923-.923.923h-.308M2 11.891v.307a.923.923 0 0 0 .923.923h.308M2 11.891h.615a.615.615 0 0 1 .616.615v.615m13.538 0v-.615a.616.616 0 0 1 .616-.616H18m-1.23 1.231H3.23m9.231-4.923a2.462 2.462 0 1 1-4.923 0 2.462 2.462 0 0 1 4.923 0Zm2.462 0h.007v.007h-.007v-.007Zm-9.846 0h.006v.007h-.006v-.007Z"
        />
      </svg>
    )
  }
)
Cash.displayName = "Cash"
export default Cash
