import * as React from "react"
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts"

import { clx } from "@/utils/clx"

import { ChartLegendContent } from "./chart-legend"
import { ChartTooltip } from "./chart-tooltip"
import {
  DEFAULT_CHART_COLORS,
  chartColorMap,
  type PieChartProps,
} from "./chart-utils"

const renderActiveShape = (props: any) => {
  return <Sector {...props} />
}

/**
 * A pie/donut chart component for visualizing proportions.
 */
const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      data,
      category,
      index,
      colors,
      height = 300,
      donut = false,
      showLegend = true,
      showTooltip = true,
      valueFormatter,
      className,
      ...props
    },
    ref
  ) => {
    const resolvedColors = data.map((_, i) => {
      const color =
        colors?.[i] ?? DEFAULT_CHART_COLORS[i % DEFAULT_CHART_COLORS.length]
      return chartColorMap[color]
    })

    return (
      <div
        ref={ref}
        className={clx(
          "shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg border border-ui-border-base p-6",
          "[&_svg]:outline-none [&_path]:outline-none",
          className
        )}
        {...props}
      >
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart style={{ outline: "none" }}>
            {showTooltip && (
              <Tooltip
                content={<ChartTooltip valueFormatter={valueFormatter} />}
                cursor={false}
                trigger="hover"
              />
            )}
            {showLegend && (
              <Legend content={<ChartLegendContent />} />
            )}
            <Pie
              data={data}
              dataKey={category}
              nameKey={index}
              cx="50%"
              cy="50%"
              innerRadius={donut ? "60%" : 0}
              outerRadius="80%"
              paddingAngle={2}
              strokeWidth={0}
              activeShape={renderActiveShape}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={resolvedColors[i]} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    )
  }
)
PieChart.displayName = "Chart.Pie"

export { PieChart, type PieChartProps }
