import * as React from "react"
import type { IconProps } from "../types"
const Sparkle2Solid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="m14.189 4.88-2.916-1.152L10.12.81C9.918.303 9.08.303 8.88.811L7.726 3.728 4.81 4.88a.668.668 0 0 0 0 1.239l2.916 1.153 1.154 2.916a.667.667 0 0 0 1.239 0l1.153-2.916 2.916-1.153a.668.668 0 0 0 0-1.24"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="M3.722 7.944c.306 0 .573.209.647.505l.436 1.746 1.746.436a.667.667 0 0 1 0 1.293l-1.746.437-.436 1.745a.667.667 0 0 1-1.294 0l-.436-1.745-1.745-.437a.667.667 0 0 1 0-1.293l1.745-.436.436-1.746a.67.67 0 0 1 .647-.505"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
Sparkle2Solid.displayName = "Sparkle2Solid"
export default Sparkle2Solid
