import * as React from "react"
import type { IconProps } from "../types"
const Linkedin = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
          fill="#0077B5"
          d="M15.25 1H4.75A3.75 3.75 0 0 0 1 4.75v10.5A3.75 3.75 0 0 0 4.75 19h10.5A3.75 3.75 0 0 0 19 15.25V4.75A3.75 3.75 0 0 0 15.25 1ZM7 15.25H4.75V7H7v8.25ZM5.875 6.049a1.318 1.318 0 0 1-1.313-1.323c0-.73.588-1.323 1.313-1.323.724 0 1.313.592 1.313 1.323 0 .73-.588 1.323-1.313 1.323ZM16 15.25h-2.25v-4.203c0-2.526-3-2.335-3 0v4.203H8.5V7h2.25v1.324C11.797 6.384 16 6.24 16 10.18v5.069Z"
        />
      </svg>
    )
  }
)
Linkedin.displayName = "Linkedin"
export default Linkedin
