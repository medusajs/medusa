import * as React from "react"
import type { IconProps } from "../types"
const JavascriptEx = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5 1h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V5a4 4 0 0 1 4-4Zm8.625 13.985c-.844 0-1.321-.44-1.688-1.037l-1.39.806c.502.99 1.529 1.746 3.118 1.746 1.625 0 2.835-.842 2.835-2.379 0-1.425-.82-2.06-2.275-2.681l-.427-.183c-.735-.317-1.052-.525-1.052-1.037 0-.414.317-.731.818-.731.492 0 .808.206 1.102.731l1.332-.853C15.434 8.377 14.652 8 13.564 8c-1.528 0-2.505.975-2.505 2.255 0 1.39.82 2.047 2.055 2.572l.427.183c.78.34 1.246.548 1.246 1.133 0 .489-.453.842-1.162.842Zm-6.631-.01c-.588 0-.832-.403-1.101-.879l-1.393.842c.403.851 1.197 1.559 2.567 1.559 1.516 0 2.555-.805 2.555-2.572V8.097H7.91v5.805c0 .853-.355 1.072-.917 1.072Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
JavascriptEx.displayName = "JavascriptEx"
export default JavascriptEx
