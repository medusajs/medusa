import * as React from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { clx } from "@/utils/clx"

import { ChartLegendContent } from "./chart-legend"
import { ChartTooltip } from "./chart-tooltip"
import { type CartesianChartProps, resolveColors } from "./chart-utils"

interface LineChartProps extends CartesianChartProps {
  /**
   * The type of curve to use for the line.
   */
  curveType?: "linear" | "monotone" | "step"
}

/**
 * A line chart component for visualizing trends over time.
 */
const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      index,
      categories,
      colors,
      height = 300,
      showLegend = true,
      showGrid = true,
      showTooltip = true,
      showXAxis = true,
      showYAxis = true,
      curveType = "monotone",
      valueFormatter,
      className,
      ...props
    },
    ref
  ) => {
    const resolvedColors = resolveColors(categories, colors)

    return (
      <div
        ref={ref}
        className={clx(
          "shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg border border-ui-border-base p-6",
          className
        )}
        {...props}
      >
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-base)"
                vertical={false}
              />
            )}
            {showXAxis && (
              <XAxis
                dataKey={index}
                tick={{ fontSize: 12, fill: "var(--fg-subtle)" }}
                axisLine={{ stroke: "var(--border-base)" }}
                tickLine={false}
              />
            )}
            {showYAxis && (
              <YAxis
                tick={{ fontSize: 12, fill: "var(--fg-subtle)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={valueFormatter}
              />
            )}
            {showTooltip && (
              <Tooltip
                content={<ChartTooltip valueFormatter={valueFormatter} />}
                cursor={{ stroke: "var(--border-strong)" }}
              />
            )}
            {showLegend && (
              <Legend content={<ChartLegendContent />} />
            )}
            {categories.map((category, i) => (
              <Line
                key={category}
                type={curveType}
                dataKey={category}
                stroke={resolvedColors[i]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    )
  }
)
LineChart.displayName = "Chart.Line"

export { LineChart, type LineChartProps }
