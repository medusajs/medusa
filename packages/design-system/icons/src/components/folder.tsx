import * as React from "react"
import type { IconProps } from "../types"
const Folder = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M2.492 10.578V10a1.733 1.733 0 0 1 1.733-1.733h11.55A1.733 1.733 0 0 1 17.508 10v.578m-6.692-4.96L9.184 3.987a1.155 1.155 0 0 0-.817-.339H4.225A1.733 1.733 0 0 0 2.492 5.38v9.24a1.733 1.733 0 0 0 1.733 1.733h11.55a1.733 1.733 0 0 0 1.733-1.733V7.69a1.733 1.733 0 0 0-1.733-1.733h-4.142c-.306 0-.6-.122-.817-.338Z"
        />
      </svg>
    )
  }
)
Folder.displayName = "Folder"
export default Folder
