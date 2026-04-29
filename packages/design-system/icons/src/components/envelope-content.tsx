import * as React from "react"
import type { IconProps } from "../types"
const EnvelopeContent = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.944 6.976v4.885c0 .982-.795 1.778-1.777 1.778H2.833a1.777 1.777 0 0 1-1.777-1.778V6.972l6.057 2.925a.89.89 0 0 0 .773 0l6.058-2.925zM2.833 4.87V1.638a.89.89 0 0 1 .89-.889h7.555a.89.89 0 0 1 .889.889v3.23M5.056 3.417h4.888M5.056 6.084h4.888"
        />
      </svg>
    )
  }
)
EnvelopeContent.displayName = "EnvelopeContent"
export default EnvelopeContent
