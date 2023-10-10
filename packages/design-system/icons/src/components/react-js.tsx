import * as React from "react"
import type { IconProps } from "../types"
const ReactJs = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
          fill="#61DAFB"
          d="M15 1H5a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4Z"
        />
        <path
          stroke="#000"
          d="M10.012 12.736c3.975 0 7.197-1.23 7.197-2.748 0-1.518-3.222-2.748-7.197-2.748S2.815 8.47 2.815 9.988c0 1.518 3.222 2.748 7.197 2.748Z"
        />
        <path
          stroke="#000"
          d="M7.632 11.362c1.987 3.442 4.664 5.618 5.978 4.859 1.314-.76.769-4.165-1.219-7.607-1.987-3.442-4.664-5.618-5.978-4.859-1.314.759-.769 4.165 1.219 7.607Z"
        />
        <path
          stroke="#000"
          d="M7.632 8.614c-1.988 3.442-2.533 6.848-1.219 7.607 1.314.758 3.991-1.417 5.978-4.86 1.988-3.442 2.533-6.847 1.22-7.606-1.315-.759-3.992 1.416-5.98 4.859Z"
        />
        <path
          fill="#000"
          d="M10 11.208a1.208 1.208 0 1 0 0-2.416 1.208 1.208 0 0 0 0 2.416Z"
        />
      </svg>
    )
  }
)
ReactJs.displayName = "ReactJs"
export default ReactJs
