import * as React from "react"
import type { IconProps } from "../types"
const BellAlert = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
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
          fill={color}
          fillRule="evenodd"
          d="M7.5.347A4.973 4.973 0 0 0 2.528 5.32v4.222c0 .568-.46 1.027-1.028 1.027a.75.75 0 0 0 0 1.5h12a.75.75 0 0 0 0-1.5c-.568 0-1.028-.46-1.028-1.027V5.32A4.973 4.973 0 0 0 7.5.347m3.472 9.195c0 .366.078.713.218 1.027H3.81a2.5 2.5 0 0 0 .218-1.027V5.32a3.473 3.473 0 0 1 6.944 0zm-2.405 3.333a.444.444 0 0 1 .435.536c-.154.73-.771 1.242-1.501 1.242S6.153 14.142 6 13.41a.445.445 0 0 1 .434-.536z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
BellAlert.displayName = "BellAlert"
export default BellAlert
