import * as React from "react"
import type { IconProps } from "../types"
const DocumentText = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.611 5.5H6.39M4.611 8.167h5.778M4.611 10.833h5.778M1.944 12.167V2.833c0-.982.796-1.777 1.778-1.777h4.966c.235 0 .462.093.628.26l3.48 3.48c.166.166.26.392.26.628v6.743c0 .982-.796 1.778-1.778 1.778H3.722a1.777 1.777 0 0 1-1.778-1.778"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12.976 5.056H9.944a.89.89 0 0 1-.888-.89v-3.02"
        />
      </svg>
    )
  }
)
DocumentText.displayName = "DocumentText"
export default DocumentText
