import * as React from "react"
import type { IconProps } from "../types"
const LightBulbSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M10 1.812a6.004 6.004 0 0 0-3.01 11.2c.5.29.812.734.826 1.182a.546.546 0 0 0 .42.514 7.7 7.7 0 0 0 .782.142.392.392 0 0 0 .436-.396v-3.392a4.9 4.9 0 0 1-.682-.125.546.546 0 0 1 .272-1.057 3.828 3.828 0 0 0 1.912 0 .546.546 0 1 1 .272 1.056c-.224.058-.452.1-.682.126v3.391c0 .238.202.427.437.397.264-.034.525-.082.781-.142a.546.546 0 0 0 .42-.514c.015-.448.326-.891.825-1.181A6.004 6.004 0 0 0 10 1.813Z"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="M7.826 15.75a.546.546 0 0 1 .638-.435 8.239 8.239 0 0 0 3.072 0 .546.546 0 1 1 .203 1.072 9.33 9.33 0 0 1-3.478 0 .546.546 0 0 1-.435-.638Zm.54 1.778a.545.545 0 0 1 .6-.486 9.957 9.957 0 0 0 2.069 0 .545.545 0 1 1 .113 1.086c-.763.08-1.533.08-2.296 0a.544.544 0 0 1-.487-.6Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
LightBulbSolid.displayName = "LightBulbSolid"
export default LightBulbSolid
