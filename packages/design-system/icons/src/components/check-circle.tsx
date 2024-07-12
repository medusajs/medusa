import * as React from "react"
import type { IconProps } from "../types"
const CheckCircle = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M8.41666 13.9446C11.9758 13.9446 14.8611 11.0593 14.8611 7.50011C14.8611 3.94094 11.9758 1.05566 8.41666 1.05566C4.85749 1.05566 1.97221 3.94094 1.97221 7.50011C1.97221 11.0593 4.85749 13.9446 8.41666 13.9446Z"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5.52777 7.72233L7.52777 9.94455L11.3055 5.05566"
          stroke={color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )
  }
)
CheckCircle.displayName = "CheckCircle"
export default CheckCircle
