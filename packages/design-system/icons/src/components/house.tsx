import * as React from "react"
import type { IconProps } from "../types"
const House = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M12.705 5.011 8.038 1.465a.89.89 0 0 0-1.076 0L2.296 5.01a.89.89 0 0 0-.352.709v6.448c0 .982.796 1.777 1.778 1.777h2.222V10.39a.89.89 0 0 1 .89-.889h1.333a.89.89 0 0 1 .889.889v3.555h2.222c.982 0 1.778-.795 1.778-1.777v-6.45a.89.89 0 0 0-.351-.707"
        />
      </svg>
    )
  }
)
House.displayName = "House"
export default House
