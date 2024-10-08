import * as React from "react"
import type { IconProps } from "../types"
const ToolsSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          <path d="M13.944 7.056H12.39V4.344l.8-1.402a.67.67 0 0 0 .062-.514L12.807.872a.67.67 0 0 0-.641-.483h-.89a.666.666 0 0 0-.64.483l-.444 1.556a.67.67 0 0 0 .06.514l.802 1.402v2.712H9.498a.667.667 0 0 0 0 1.333h.222v4.667c0 .857.698 1.555 1.556 1.555h.889c.858 0 1.555-.698 1.555-1.555V8.389h.223a.667.667 0 0 0 0-1.333zm-1.555 6c0 .122-.1.222-.222.222h-.89a.22.22 0 0 1-.221-.222V8.389h1.333zM6.3 1.012a.667.667 0 0 0-1.023.564v2.592c0 .122-.1.222-.222.222H3.277a.22.22 0 0 1-.222-.222V1.575a.666.666 0 0 0-1.023-.564A3.98 3.98 0 0 0 .167 4.39c0 1.437.771 2.752 2 3.461v5.206c0 .857.698 1.555 1.555 1.555h.89c.857 0 1.555-.698 1.555-1.556V7.85c1.228-.71 2-2.024 2-3.461 0-1.376-.698-2.64-1.867-3.377" />
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
ToolsSolid.displayName = "ToolsSolid"
export default ToolsSolid
