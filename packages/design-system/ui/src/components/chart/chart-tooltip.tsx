import * as React from "react"

import { clx } from "@/utils/clx"

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
  valueFormatter?: (value: number) => string
}

const ChartTooltip = ({
  active,
  payload,
  label,
  valueFormatter,
}: ChartTooltipProps) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      className={clx(
        "bg-ui-bg-base border-ui-border-base shadow-elevation-tooltip",
        "rounded-lg border px-3 py-2.5"
      )}
    >
      {label && (
        <p className="txt-compact-small-plus text-ui-fg-base mb-1.5 border-b border-ui-border-base pb-1.5">
          {label}
        </p>
      )}
      <div className="flex flex-col gap-1.5">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: entry.color }}
            />
            <span className="txt-compact-small text-ui-fg-subtle">
              {entry.name}
            </span>
            <span className="txt-compact-small-plus text-ui-fg-base ml-auto pl-4 tabular-nums">
              {valueFormatter
                ? valueFormatter(entry.value)
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
ChartTooltip.displayName = "ChartTooltip"

export { ChartTooltip }
