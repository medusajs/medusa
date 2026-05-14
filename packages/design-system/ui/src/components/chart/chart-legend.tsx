import * as React from "react"

import { clx } from "@/utils/clx"

interface ChartLegendContentProps {
  payload?: Array<{
    value: string
    color: string
  }>
  className?: string
}

const ChartLegendContent = ({
  payload,
  className,
}: ChartLegendContentProps) => {
  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={clx(
        "flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-ui-border-base pt-4 mt-2",
        className
      )}
    >
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-[3px]"
            style={{ backgroundColor: entry.color }}
          />
          <span className="txt-compact-small text-ui-fg-subtle">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}
ChartLegendContent.displayName = "ChartLegendContent"

export { ChartLegendContent }
