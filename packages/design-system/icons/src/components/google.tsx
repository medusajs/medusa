import * as React from "react"
import type { IconProps } from "../types"
const Google = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
          fill="#4280EF"
          d="M18.822 10.215c0-.608-.059-1.236-.157-1.824h-8.491v3.471h4.863a4.092 4.092 0 0 1-1.804 2.726l2.902 2.255c1.707-1.588 2.687-3.902 2.687-6.628Z"
        />
        <path
          fill="#34A353"
          d="M10.174 19.002c2.432 0 4.471-.804 5.962-2.177l-2.903-2.236c-.804.55-1.843.863-3.059.863-2.353 0-4.334-1.588-5.06-3.706l-2.98 2.294a8.992 8.992 0 0 0 8.04 4.962Z"
        />
        <path
          fill="#F6B704"
          d="M5.115 11.726a5.468 5.468 0 0 1 0-3.452L2.134 5.96a9.013 9.013 0 0 0 0 8.08l2.98-2.314Z"
        />
        <path
          fill="#E54335"
          d="M10.174 4.568a4.91 4.91 0 0 1 3.452 1.353l2.569-2.589A8.663 8.663 0 0 0 10.175 1 8.992 8.992 0 0 0 2.133 5.96l2.98 2.314c.726-2.138 2.707-3.706 5.06-3.706Z"
        />
      </svg>
    )
  }
)
Google.displayName = "Google"
export default Google
