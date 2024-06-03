import * as React from "react"
import type { IconProps } from "../types"
const Vercel = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
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
          fill="#000"
          d="M6.84.767a6.9 6.9 0 0 0-3.575 1.468c-.34.274-.897.847-1.142 1.175A6.9 6.9 0 0 0 .809 6.56a8 8 0 0 0-.04 1.517c.11 1.143.475 2.2 1.069 3.1a6.76 6.76 0 0 0 4.725 3.014c.388.058 1.13.077 1.517.04 1.143-.111 2.198-.475 3.098-1.07a6.76 6.76 0 0 0 3.013-4.728c.058-.388.077-1.13.04-1.518-.135-1.383-.628-2.608-1.472-3.656a8.6 8.6 0 0 0-1.175-1.143A6.9 6.9 0 0 0 8.437.801C8.117.754 7.152.733 6.84.767M9.24 6.966a633 633 0 0 1 1.665 2.922c0 .005-1.502.01-3.338.01s-3.338-.005-3.338-.013c0-.02 3.333-5.85 3.34-5.84.003.003.758 1.318 1.67 2.92"
        />
      </svg>
    )
  }
)
Vercel.displayName = "Vercel"
export default Vercel
