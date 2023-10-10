import * as React from "react"
import type { IconProps } from "../types"
const FolderOpen = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3.495 8.247c.089-.014.18-.02.272-.02h12.466c.092 0 .183.006.27.02m-13.008 0a1.774 1.774 0 0 0-1.484 2.004l.675 4.73a1.774 1.774 0 0 0 1.756 1.523h11.116a1.774 1.774 0 0 0 1.756-1.523l.675-4.73a1.774 1.774 0 0 0-1.485-2.004m-13.009 0 .001-2.977A1.774 1.774 0 0 1 5.27 3.496h3.058c.314 0 .615.125.836.347l1.673 1.671c.222.222.522.347.836.347h3.058a1.774 1.774 0 0 1 1.774 1.774v.612"
        />
      </svg>
    )
  }
)
FolderOpen.displayName = "FolderOpen"
export default FolderOpen
