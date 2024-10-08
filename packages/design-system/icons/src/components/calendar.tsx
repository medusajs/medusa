import * as React from "react"
import type { IconProps } from "../types"
const Calendar = React.forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        fill="none"
        ref={ref}
        {...props}
      >
        <path
          fill={color}
          d="M6.611 8.611c0-.49.4-.889.889-.889a.89.89 0 0 1 0 1.778.89.89 0 0 1-.889-.889M10.611 9.5c.49 0 .889-.4.889-.889a.89.89 0 0 0-.889-.889.89.89 0 0 0-.889.89c0 .489.4.888.89.888M6.611 11.278c0-.49.4-.89.889-.89a.89.89 0 0 1 0 1.778.89.89 0 0 1-.889-.888M4.389 10.389a.89.89 0 0 0-.889.889c0 .49.4.889.889.889a.89.89 0 0 0 0-1.778M9.722 11.278a.89.89 0 0 1 1.778 0c0 .49-.4.889-.889.889a.89.89 0 0 1-.889-.89"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="M4.611.306a.75.75 0 0 1 .75.75v1.027H9.64V1.056a.75.75 0 1 1 1.5 0v1.027h.583a2.53 2.53 0 0 1 2.528 2.528v7.556a2.53 2.53 0 0 1-2.528 2.527H3.278A2.53 2.53 0 0 1 .75 12.167V4.61a2.53 2.53 0 0 1 2.528-2.528h.583V1.056a.75.75 0 0 1 .75-.75M12.75 4.61v.584H2.25V4.61c0-.568.46-1.028 1.028-1.028h8.444c.568 0 1.028.46 1.028 1.028m0 2.084H2.25v5.472c0 .567.46 1.027 1.028 1.027h8.444c.568 0 1.028-.46 1.028-1.027z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
Calendar.displayName = "Calendar"
export default Calendar
