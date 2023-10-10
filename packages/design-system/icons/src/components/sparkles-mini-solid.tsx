import * as React from "react"
import type { IconProps } from "../types"
const SparklesMiniSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M8 5a.5.5 0 0 1 .48.363l.542 1.897a2.5 2.5 0 0 0 1.717 1.718l1.898.542a.5.5 0 0 1 0 .961l-1.898.542a2.5 2.5 0 0 0-1.717 1.718l-.542 1.897a.5.5 0 0 1-.961 0l-.542-1.897a2.5 2.5 0 0 0-1.718-1.718l-1.897-.542a.5.5 0 0 1 0-.961l1.897-.542A2.5 2.5 0 0 0 6.977 7.26l.542-1.897A.5.5 0 0 1 7.999 5Zm6-2a.5.5 0 0 1 .485.38l.172.69a1.753 1.753 0 0 0 1.273 1.273l.69.172a.5.5 0 0 1 0 .97l-.69.173a1.753 1.753 0 0 0-1.273 1.273l-.172.69a.5.5 0 0 1-.971 0l-.172-.69a1.75 1.75 0 0 0-1.273-1.273l-.691-.172a.5.5 0 0 1 0-.97l.69-.173a1.75 1.75 0 0 0 1.274-1.273l.172-.69a.5.5 0 0 1 .485-.38Zm-1 9a.5.5 0 0 1 .474.342l.263.79a1 1 0 0 0 .632.631l.788.264a.5.5 0 0 1 0 .948l-.788.263a1 1 0 0 0-.632.632l-.264.789a.5.5 0 0 1-.948 0l-.263-.79a1 1 0 0 0-.632-.631l-.789-.263a.5.5 0 0 1 0-.948l.789-.264a1 1 0 0 0 .632-.632l.263-.789a.5.5 0 0 1 .474-.341Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
SparklesMiniSolid.displayName = "SparklesMiniSolid"
export default SparklesMiniSolid
