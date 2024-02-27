import * as React from "react"
import type { IconProps } from "../types"
const KeySolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M13.125 1.25a5.625 5.625 0 0 0-5.543 6.588c.056.325-.026.598-.184.755L1.982 14.01a2.5 2.5 0 0 0-.732 1.768v2.348c0 .345.28.625.625.625H5a.625.625 0 0 0 .625-.625v-1.25h1.25a.625.625 0 0 0 .625-.625V15h1.25a.625.625 0 0 0 .442-.183l2.215-2.215c.158-.158.43-.24.755-.184a5.624 5.624 0 1 0 .963-11.168Zm0 2.5a.625.625 0 1 0 0 1.25A1.875 1.875 0 0 1 15 6.875a.625.625 0 1 0 1.25 0 3.125 3.125 0 0 0-3.125-3.125Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
KeySolid.displayName = "KeySolid"
export default KeySolid
