import * as React from "react"
import type { IconProps } from "../types"
const Calendar = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M5.625 2.5v1.875m8.75-1.875v1.875M2.5 15.625V6.25a1.875 1.875 0 0 1 1.875-1.875h11.25A1.875 1.875 0 0 1 17.5 6.25v9.375m-15 0A1.875 1.875 0 0 0 4.375 17.5h11.25a1.875 1.875 0 0 0 1.875-1.875m-15 0v-6.25A1.875 1.875 0 0 1 4.375 7.5h11.25A1.875 1.875 0 0 1 17.5 9.375v6.25m-7.5-5h.007v.007H10v-.007Zm0 1.875h.007v.007H10V12.5Zm0 1.875h.007v.007H10v-.007ZM8.125 12.5h.007v.007h-.007V12.5Zm0 1.875h.007v.007h-.007v-.007ZM6.25 12.5h.007v.007H6.25V12.5Zm0 1.875h.007v.007H6.25v-.007Zm5.625-3.75h.007v.007h-.007v-.007Zm0 1.875h.007v.007h-.007V12.5Zm0 1.875h.007v.007h-.007v-.007Zm1.875-3.75h.007v.007h-.007v-.007Zm0 1.875h.007v.007h-.007V12.5Z"
        />
      </svg>
    )
  }
)
Calendar.displayName = "Calendar"
export default Calendar
