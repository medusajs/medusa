import * as React from "react"
import type { IconProps } from "../types"
const ThumbDown = React.forwardRef<SVGSVGElement, IconProps>(
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
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M6.25 12.5h1.875m6.687-8.125c.009.042.023.083.043.123.492 1 .77 2.125.77 3.314a7.467 7.467 0 0 1-.832 3.438m.019-6.875c-.064-.304.152-.625.479-.625h.756c.741 0 1.428.432 1.644 1.14.282.925.434 1.906.434 2.923 0 1.294-.246 2.53-.692 3.664-.256.646-.905 1.023-1.6 1.023h-.877c-.393 0-.621-.463-.417-.8.09-.147.175-.297.254-.45m.019-6.875h-1.079a3.75 3.75 0 0 1-1.186-.192l-2.594-.866a3.75 3.75 0 0 0-1.186-.192H5.42c-.515 0-1.014.206-1.337.607A9.958 9.958 0 0 0 1.875 10c0 .362.02.72.057 1.07.09.852.856 1.43 1.711 1.43h2.605c.515 0 .826.603.605 1.068a6.226 6.226 0 0 0-.603 2.682 1.875 1.875 0 0 0 1.875 1.875.625.625 0 0 0 .625-.625v-.527c0-.478.092-.95.268-1.394.254-.633.775-1.108 1.378-1.429a7.534 7.534 0 0 0 2.383-2c.415-.528 1.022-.9 1.694-.9h.32"
        />
      </svg>
    )
  }
)
ThumbDown.displayName = "ThumbDown"
export default ThumbDown
