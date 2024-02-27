import * as React from "react"
import type { IconProps } from "../types"
const Gatsby = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
        <path fill="#639" d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path
          fill="#fff"
          d="M4.986 15.014c-1.35-1.35-2.058-3.15-2.058-4.885l7.008 6.942c-1.8-.064-3.6-.707-4.95-2.057Zm6.557 1.865L3.12 8.457C3.828 5.307 6.657 2.93 10 2.93c2.379 0 4.436 1.157 5.721 2.892l-.964.836C13.664 5.18 11.928 4.214 10 4.214c-2.507 0-4.629 1.607-5.464 3.857l7.393 7.393c1.864-.643 3.278-2.25 3.728-4.178h-3.086V10h4.5c0 3.343-2.378 6.171-5.528 6.879Z"
        />
      </svg>
    )
  }
)
Gatsby.displayName = "Gatsby"
export default Gatsby
