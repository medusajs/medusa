import * as React from "react"
import type { IconProps } from "../types"
const TaxInclusive = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          fillRule="evenodd"
          d="M6.713.838a1.61 1.61 0 0 1 1.574 0l4.521 2.531h.001c.507.286.823.823.823 1.407v.356c0 .89-.722 1.611-1.611 1.611l-9.042.001c-.89 0-1.611-.722-1.611-1.611v-.357c0-.582.314-1.12.824-1.406zm.842 1.309a.11.11 0 0 0-.108 0L2.925 4.678a.11.11 0 0 0-.057.097v.357c0 .061.05.111.111.111h9.042c.06 0 .11-.05.11-.112v-.356a.11.11 0 0 0-.056-.098zM2.979 7.396a.75.75 0 0 1 .75.75v3.986h1.514V8.146a.75.75 0 0 1 1.5 0v3.986h.346c.414 0 .812.337.812.75 0 .415-.398.75-.812.75H2.118a.75.75 0 0 1 0-1.5h.111V8.146a.75.75 0 0 1 .75-.75m6.028 0a.75.75 0 0 1 .75.75v1.292a.75.75 0 0 1-1.5 0V8.146a.75.75 0 0 1 .75-.75m5.588.733a.75.75 0 0 1 .2 1.042l-3.215 4.736a.75.75 0 0 1-1.16.1l-1.522-1.579a.75.75 0 0 1 1.08-1.041l.88.913 2.695-3.971a.75.75 0 0 1 1.042-.2"
          clipRule="evenodd"
        />
        <path
          fill={color}
          d="M7.5 4.701a.861.861 0 1 0 0-1.722.861.861 0 0 0 0 1.722"
        />
      </svg>
    )
  }
)
TaxInclusive.displayName = "TaxInclusive"
export default TaxInclusive
