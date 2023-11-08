import * as React from "react"
import type { IconProps } from "../types"
const Stripe = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>(
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
          fill="#6772E5"
          fillRule="evenodd"
          d="M8.794 6.555c0-.728.606-1.01 1.584-1.01 1.62.036 3.209.447 4.642 1.202V2.353a12.317 12.317 0 0 0-4.642-.852c-3.772 0-6.301 1.975-6.301 5.274 0 5.162 7.088 4.324 7.088 6.549 0 .87-.744 1.14-1.79 1.14-1.544 0-3.537-.639-5.1-1.489v4.45c1.609.701 3.344 1.067 5.1 1.075 3.876 0 6.548-1.915 6.548-5.271 0-5.571-7.129-4.576-7.129-6.673v-.001Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
Stripe.displayName = "Stripe"
export default Stripe
