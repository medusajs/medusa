import * as React from "react"
import type { IconProps } from "../types"
const GatsbyEx = React.forwardRef<SVGSVGElement, IconProps>(
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
          fillRule="evenodd"
          d="M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-16.072.129c0 1.735.708 3.535 2.058 4.885 1.35 1.35 3.15 1.993 4.95 2.057L2.928 10.13Zm.193-1.672 8.422 8.422c3.15-.708 5.528-3.536 5.528-6.879h-4.5v1.286h3.086c-.45 1.928-1.864 3.535-3.729 4.178L4.536 8.071C5.37 5.821 7.493 4.214 10 4.214c1.928 0 3.664.965 4.757 2.443l.964-.836C14.436 4.086 12.38 2.93 10 2.93c-3.343 0-6.172 2.378-6.879 5.528Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
GatsbyEx.displayName = "GatsbyEx"
export default GatsbyEx
