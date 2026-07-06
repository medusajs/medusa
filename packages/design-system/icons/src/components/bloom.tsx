import * as React from "react"
import type { IconProps } from "../types"
const Bloom = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
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
          fill="#ED6AFF"
          fillRule="evenodd"
          d="M7.5.75c.852 0 1.562.762 1.95 2.043 1.184-.631 2.223-.668 2.825-.066.601.601.563 1.642-.068 2.823 1.281.389 2.043 1.099 2.043 1.95s-.762 1.561-2.043 1.95c.63 1.181.668 2.224.067 2.824-.6.601-1.642.564-2.823-.067-.39 1.28-1.1 2.043-1.95 2.043-.852 0-1.562-.762-1.95-2.043-1.184.63-2.224.667-2.825.066s-.563-1.642.067-2.823C1.513 9.061.75 8.351.75 7.5s.763-1.561 2.043-1.95c-.63-1.181-.667-2.224-.066-2.824.6-.601 1.642-.564 2.823.067C5.94 1.513 6.65.75 7.5.75m2.11 5.063a1.266 1.266 0 1 0 0 2.53 1.266 1.266 0 0 0 0-2.53m-3.797-.844a1.266 1.266 0 1 0 0 2.531 1.266 1.266 0 0 0 0-2.531"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
Bloom.displayName = "Bloom"
export default Bloom
