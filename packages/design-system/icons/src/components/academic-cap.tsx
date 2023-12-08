import * as React from "react"
import type { IconProps } from "../types"
const AcademicCap = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M3.55 8.456a50.366 50.366 0 0 0-.41 5.289A40.52 40.52 0 0 1 10 17.42a40.528 40.528 0 0 1 6.86-3.675 50.374 50.374 0 0 0-.41-5.29m0 0c.73-.244 1.47-.471 2.216-.678A49.919 49.919 0 0 0 10 2.911a49.922 49.922 0 0 0-8.666 4.867A42.152 42.152 0 0 1 10 11.241a42.27 42.27 0 0 1 6.45-2.785ZM5.626 12.5a.625.625 0 1 0 0-1.25.625.625 0 0 0 0 1.25Zm0 0V9.437A46.151 46.151 0 0 1 10 7.036M4.16 16.66a4.983 4.983 0 0 0 1.465-3.536v-1.25"
        />
      </svg>
    )
  }
)
AcademicCap.displayName = "AcademicCap"
export default AcademicCap
