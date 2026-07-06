import * as React from "react"
import type { IconProps } from "../types"
const File = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.976 5.055H9.944a.89.89 0 0 1-.888-.889v-3.02"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M1.944 12.167V2.833c0-.982.796-1.777 1.778-1.777h4.966c.235 0 .462.093.628.26l3.48 3.48c.166.166.26.392.26.628v6.743c0 .982-.796 1.778-1.778 1.778H3.722a1.777 1.777 0 0 1-1.778-1.778"
        />
      </svg>
    )
  }
)
File.displayName = "File"
export default File
