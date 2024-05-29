import * as React from "react"
import type { IconProps } from "../types"
const Gatsby = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
        <g clipPath="url(#a)">
          <path
            fill="#639"
            d="M7.5 14.25a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5"
          />
          <path
            fill="#fff"
            d="M3.74 11.26c-1.013-1.012-1.544-2.362-1.544-3.663l5.256 5.207c-1.35-.049-2.7-.53-3.713-1.543m4.917 1.399L2.341 6.343C2.87 3.98 4.993 2.197 7.5 2.197c1.784 0 3.327.867 4.29 2.17l-.722.626c-.82-1.109-2.122-1.832-3.568-1.832-1.88 0-3.472 1.205-4.098 2.893l5.544 5.544c1.399-.482 2.46-1.687 2.797-3.134H9.428V7.5h3.375c0 2.507-1.783 4.629-4.146 5.159"
          />
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
Gatsby.displayName = "Gatsby"
export default Gatsby
