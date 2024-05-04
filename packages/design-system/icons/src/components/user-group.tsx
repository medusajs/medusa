import * as React from "react"
import type { IconProps } from "../types"
const UserGroup = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M14.216 12.934a2.5 2.5 0 0 1 3.902 2.267c-1 .35-2.062.485-3.118.399a4.996 4.996 0 0 0-5-4.975 4.996 4.996 0 0 0-4.215 2.31m9.214 2.664.001.026c0 .188-.01.373-.03.555A9.953 9.953 0 0 1 10 17.5a9.952 9.952 0 0 1-4.97-1.32A5.052 5.052 0 0 1 5 15.6m0 0a7.484 7.484 0 0 1-3.116-.398 2.5 2.5 0 0 1 3.901-2.267M5 15.599a4.977 4.977 0 0 1 .785-2.664m6.715-7.31a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm5 2.5a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm-11.25 0a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Z"
        />
      </svg>
    )
  }
)
UserGroup.displayName = "UserGroup"
export default UserGroup
