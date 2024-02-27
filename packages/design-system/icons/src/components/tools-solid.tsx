import * as React from "react"
import type { IconProps } from "../types"
const ToolsSolid = React.forwardRef<SVGSVGElement, IconProps>(
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
          fill={color}
          fillRule="evenodd"
          d="M9.998 6.064a3.937 3.937 0 0 1 5.08-3.769.562.562 0 0 1 .235.936l-2.49 2.489a1.686 1.686 0 0 0 1.456 1.454l2.488-2.489a.563.563 0 0 1 .936.235A3.937 3.937 0 0 1 13.6 9.986c-.764-.064-1.403.075-1.732.476l-5.362 6.513a2.473 2.473 0 1 1-3.483-3.482L9.536 8.13c.4-.33.54-.968.475-1.731a3.994 3.994 0 0 1-.013-.335Zm-5.912 9.28a.563.563 0 0 1 .562-.562h.006a.562.562 0 0 1 .563.562v.006a.563.563 0 0 1-.563.563h-.006a.562.562 0 0 1-.562-.563v-.006Z"
          clipRule="evenodd"
        />
        <path
          fill={color}
          d="M8.555 7.48 6.904 5.83V4.658a.562.562 0 0 0-.273-.483L3.819 2.487a.562.562 0 0 0-.687.085l-.563.562a.563.563 0 0 0-.084.687l1.687 2.812a.563.563 0 0 0 .482.273h1.173l1.546 1.547 1.182-.973Z"
        />
        <path
          fill={color}
          fillRule="evenodd"
          d="m10.415 13.997 3.137 3.136a2.53 2.53 0 1 0 3.58-3.58l-2.48-2.478c-.38.054-.765.065-1.148.033a1.997 1.997 0 0 0-.65.031.442.442 0 0 0-.125.047l-2.314 2.811Zm2.56-1.02a.562.562 0 0 1 .795 0l1.406 1.407a.563.563 0 1 1-.795.795l-1.406-1.406a.563.563 0 0 1 0-.795Z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
)
ToolsSolid.displayName = "ToolsSolid"
export default ToolsSolid
