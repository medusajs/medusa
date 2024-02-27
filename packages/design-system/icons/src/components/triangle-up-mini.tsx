import * as React from "react"
import type { IconProps } from "../types"
const TriangleUpMini = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M7.41 12.5c-.163 0-.323-.037-.464-.108a.849.849 0 0 1-.334-.293.68.68 0 0 1-.112-.397.693.693 0 0 1 .142-.39l2.59-3.454c.082-.11.195-.2.33-.263a1.04 1.04 0 0 1 .876 0 .868.868 0 0 1 .33.263l2.59 3.455a.693.693 0 0 1 .141.39.68.68 0 0 1-.111.396.85.85 0 0 1-.335.293c-.14.07-.3.108-.464.108H7.41Z"
        />
      </svg>
    )
  }
)
TriangleUpMini.displayName = "TriangleUpMini"
export default TriangleUpMini
