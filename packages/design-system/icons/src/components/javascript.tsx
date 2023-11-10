import * as React from "react"
import type { IconProps } from "../types"
const Javascript = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
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
          fill="#F7DF1E"
          d="M15 1H5a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4Z"
        />
        <path
          fill="#000"
          d="M11.937 13.948c.367.598.844 1.037 1.688 1.037.71 0 1.162-.353 1.162-.842 0-.585-.465-.793-1.246-1.133l-.428-.183c-1.234-.525-2.054-1.182-2.054-2.572 0-1.28.977-2.255 2.505-2.255 1.088 0 1.87.378 2.434 1.367l-1.332.853c-.294-.525-.61-.731-1.102-.731-.5 0-.818.317-.818.731 0 .512.317.72 1.052 1.037l.427.183c1.454.622 2.275 1.256 2.275 2.681 0 1.537-1.21 2.379-2.835 2.379-1.59 0-2.616-.755-3.118-1.746l1.39-.806Zm-6.044.148c.269.476.513.878 1.101.878.562 0 .917-.219.917-1.072V8.097h1.71v5.828c0 1.767-1.038 2.572-2.554 2.572-1.37 0-2.164-.707-2.567-1.56l1.393-.84Z"
        />
      </svg>
    )
  }
)
Javascript.displayName = "Javascript"
export default Javascript
