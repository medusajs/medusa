import * as React from "react"
import type { IconProps } from "../types"
const TaxExclusive = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M6.713.838a1.61 1.61 0 0 1 1.574 0l4.521 2.531h.001c.507.286.823.823.823 1.407v.356c0 .89-.722 1.611-1.611 1.611l-9.042.001c-.89 0-1.611-.722-1.611-1.611v-.357c0-.582.314-1.12.823-1.406zm.842 1.309a.11.11 0 0 0-.108 0L2.924 4.678a.11.11 0 0 0-.056.097v.357c0 .061.05.111.111.111h9.042c.06 0 .11-.05.11-.112v-.356a.11.11 0 0 0-.056-.098zM2.979 7.396a.75.75 0 0 1 .75.75v3.986h1.514V8.146a.75.75 0 0 1 1.5 0v3.986h.41c.414 0 .78.344.78.759 0 .414-.366.741-.78.741H2.117a.75.75 0 0 1 0-1.5h.111V8.146a.75.75 0 0 1 .75-.75M9.338 8.72a.75.75 0 0 1 1.06 0l1.623 1.622 1.622-1.622a.75.75 0 1 1 1.06 1.06l-1.621 1.623 1.622 1.622a.75.75 0 0 1-1.06 1.061l-1.623-1.623-1.623 1.623a.75.75 0 0 1-1.06-1.06l1.622-1.623L9.338 9.78a.75.75 0 0 1 0-1.06"
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
TaxExclusive.displayName = "TaxExclusive"
export default TaxExclusive
