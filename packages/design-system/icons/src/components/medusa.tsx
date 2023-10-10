import * as React from "react"
import type { IconProps } from "../types"
const Medusa = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
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
          fill="#030712"
          d="m16.245 3.922-4.076-2.345a4.297 4.297 0 0 0-4.301 0L3.773 3.922a4.331 4.331 0 0 0-2.141 3.714v4.709c0 1.538.826 2.945 2.14 3.714l4.077 2.364c1.333.77 2.967.77 4.301 0l4.076-2.364a4.269 4.269 0 0 0 2.141-3.714V7.636c.038-1.52-.789-2.945-2.122-3.714Zm-6.236 10.261A4.19 4.19 0 0 1 5.82 10a4.19 4.19 0 0 1 4.189-4.183c2.31 0 4.207 1.876 4.207 4.183s-1.878 4.183-4.207 4.183Z"
        />
      </svg>
    )
  }
)
Medusa.displayName = "Medusa"
export default Medusa
