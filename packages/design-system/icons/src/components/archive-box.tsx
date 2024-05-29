import * as React from "react"
import type { IconProps } from "../types"
const ArchiveBox = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          clipPath="url(#a)"
        >
          <path d="M12.611 5.056v6.222c0 .982-.795 1.778-1.778 1.778H4.167a1.777 1.777 0 0 1-1.778-1.778V5.056M13.056 1.944H1.944a.89.89 0 0 0-.888.89v1.333c0 .49.398.888.888.888h11.112a.89.89 0 0 0 .888-.888V2.833a.89.89 0 0 0-.889-.889M5.722 7.722h3.556" />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h15v15H0z" />
          </clipPath>
        </defs>
      </svg>
    )
  }
)
ArchiveBox.displayName = "ArchiveBox"
export default ArchiveBox
