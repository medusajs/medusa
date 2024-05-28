import * as React from "react"
import type { IconProps } from "../types"
const Folder = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M1.875 7.292V3.958c0-.92.746-1.666 1.667-1.666h1.626c.505 0 .983.229 1.3.623l.502.627h4.488c.921 0 1.667.746 1.667 1.666v2.37"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3.542 5.625h7.916c.921 0 1.667.746 1.667 1.667v3.75c0 .92-.746 1.666-1.667 1.666H3.542c-.921 0-1.667-.745-1.667-1.666v-3.75c0-.921.746-1.667 1.667-1.667"
        />
      </svg>
    )
  }
)
Folder.displayName = "Folder"
export default Folder
