import * as React from "react"
import type { IconProps } from "../types"
const ReactJs = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
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
          fill="#61DAFB"
          d="M11.25.75h-7.5a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3h7.5a3 3 0 0 0 3-3v-7.5a3 3 0 0 0-3-3"
        />
        <path
          stroke="#000"
          strokeWidth={0.75}
          d="M7.509 9.552c2.98 0 5.397-.923 5.397-2.061S10.49 5.43 7.51 5.43 2.11 6.353 2.11 7.49c0 1.14 2.417 2.062 5.398 2.062Z"
        />
        <path
          stroke="#000"
          strokeWidth={0.75}
          d="M5.724 8.521c1.49 2.582 3.498 4.214 4.483 3.644.986-.569.577-3.123-.914-5.705C7.803 3.88 5.795 2.247 4.81 2.816c-.986.57-.577 3.124.914 5.705Z"
        />
        <path
          stroke="#000"
          strokeWidth={0.75}
          d="M5.724 6.46c-1.49 2.582-1.9 5.136-.914 5.705.985.57 2.993-1.062 4.483-3.644s1.9-5.136.914-5.705S7.214 3.88 5.724 6.46Z"
        />
        <path
          fill="#000"
          d="M7.5 8.406a.906.906 0 1 0 0-1.812.906.906 0 0 0 0 1.812"
        />
      </svg>
    )
  }
)
ReactJs.displayName = "ReactJs"
export default ReactJs
