import * as React from "react"
import type { IconProps } from "../types"
const CloneDashed = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M9.056 13.944H2.833a1.78 1.78 0 0 1-1.777-1.777V5.944c0-.981.795-1.777 1.777-1.777h6.223c.981 0 1.777.796 1.777 1.777v6.223c0 .981-.796 1.777-1.777 1.777M5.944 1.055a1.78 1.78 0 0 0-1.648 1.112M9.944 1.056H8.167M13.944 2.834c0-.983-.795-1.778-1.777-1.778M13.945 6.834V5.056M12.833 10.705a1.78 1.78 0 0 0 1.111-1.65"
        />
      </svg>
    )
  }
)
CloneDashed.displayName = "CloneDashed"
export default CloneDashed
