import * as React from "react"
import type { IconProps } from "../types"
const SunSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g fill={color} clipPath="url(#a)">
          <path d="M7.5 2.333c.357 0 .646-.289.646-.646v-.86a.646.646 0 0 0-1.292 0v.86c0 .357.29.646.646.646M11.61 4.036a.64.64 0 0 0 .457-.19l.608-.608a.646.646 0 0 0-.913-.914l-.61.609a.646.646 0 0 0 .458 1.103M14.174 6.854h-.861a.646.646 0 0 0 0 1.292h.86a.646.646 0 0 0 0-1.292M12.067 11.154a.646.646 0 1 0-.914.913l.609.61a.644.644 0 0 0 .912 0 .646.646 0 0 0 0-.915l-.608-.608M7.5 12.667a.646.646 0 0 0-.646.646v.86a.646.646 0 0 0 1.292 0v-.86a.646.646 0 0 0-.646-.646M2.934 11.154l-.61.608a.646.646 0 0 0 .914.914l.608-.609a.646.646 0 0 0-.912-.913M2.333 7.5a.646.646 0 0 0-.645-.646H.826a.646.646 0 0 0 0 1.292h.862c.356 0 .645-.29.645-.646M2.933 3.846a.644.644 0 0 0 .913 0 .646.646 0 0 0 0-.913l-.609-.61a.646.646 0 1 0-.913.915zM7.5 11.806a4.306 4.306 0 1 0 0-8.611 4.306 4.306 0 0 0 0 8.61" />
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
SunSolid.displayName = "SunSolid"
export default SunSolid
