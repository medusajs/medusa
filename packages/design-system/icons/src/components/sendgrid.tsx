import * as React from "react"
import type { IconProps } from "../types"
const Sendgrid = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
  (props, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          fill="#51A9E3"
          d="M9.75.75h-3.6c-.495 0-.9.405-.9.9v2.7c0 .495.405.9.9.9h2.7c.495 0 .9.405.9.9v2.7c0 .495.405.9.9.9h2.7c.495 0 .9-.405.9-.9V1.2a.45.45 0 0 0-.45-.45zM5.25 14.25h3.6c.495 0 .9-.405.9-.9v-2.7c0-.495-.405-.9-.9-.9h-2.7a.903.903 0 0 1-.9-.9v-2.7c0-.495-.405-.9-.9-.9h-2.7c-.495 0-.9.405-.9.9v7.65c0 .247.202.45.45.45z"
        />
      </svg>
    )
  }
)
Sendgrid.displayName = "Sendgrid"
export default Sendgrid
