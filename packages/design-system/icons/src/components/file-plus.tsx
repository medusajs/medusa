import * as React from "react"
import type { IconProps } from "../types"
const FilePlus = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.611 5.5H6.39M4.611 8.166h3.664M12.976 5.055H9.944a.89.89 0 0 1-.888-.889v-3.02M11.827 9.074v4.445M14.049 11.296H9.604"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.056 6.43V5.424a.89.89 0 0 0-.26-.629l-3.48-3.479a.9.9 0 0 0-.628-.26H3.722c-.982 0-1.778.796-1.778 1.777v9.334c0 .981.796 1.778 1.778 1.778h4.36"
        />
      </svg>
    )
  }
)
FilePlus.displayName = "FilePlus"
export default FilePlus
