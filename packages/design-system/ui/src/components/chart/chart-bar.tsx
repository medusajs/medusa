import * as React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { clx } from "@/utils/clx"

import { ChartLegendContent } from "./chart-legend"
import { ChartTooltip } from "./chart-tooltip"
import { type CartesianChartProps, resolveColors } from "./chart-utils"

interface BarChartProps extends CartesianChartProps {
  /**
   * Whether to stack the bars.
   */
  stacked?: boolean
  /**
   * The layout direction of the chart.
   */
  layout?: "horizontal" | "vertical"
}

/**
 * A bar chart component for comparing categorical data.
 */
const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
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
      stacked = false,
      layout = "horizontal",
      valueFormatter,
      className,
      ...props
    },
    ref
  ) => {
    const resolvedColors = resolveColors(categories, colors)
    const isVertical = layout === "vertical"

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
          <RechartsBarChart
            data={data}
            layout={isVertical ? "vertical" : "horizontal"}
          >
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-base)"
                horizontal={!isVertical}
                vertical={isVertical}
              />
            )}
            {isVertical ? (
              <>
                {showYAxis && (
                  <YAxis
                    dataKey={index}
                    type="category"
                    tick={{ fontSize: 12, fill: "var(--fg-subtle)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                )}
                {showXAxis && (
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: "var(--fg-subtle)" }}
                    axisLine={{ stroke: "var(--border-base)" }}
                    tickLine={false}
                    tickFormatter={valueFormatter}
                  />
                )}
              </>
            ) : (
              <>
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
              </>
            )}
            {showTooltip && (
              <Tooltip
                content={<ChartTooltip valueFormatter={valueFormatter} />}
                cursor={{ fill: "var(--bg-base-hover)", opacity: 0.5 }}
              />
            )}
            {showLegend && (
              <Legend content={<ChartLegendContent />} />
            )}
            {categories.map((category, i) => (
              <Bar
                key={category}
                dataKey={category}
                fill={resolvedColors[i]}
                stackId={stacked ? "stack" : undefined}
                radius={stacked ? undefined : [4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    )
  }
)
BarChart.displayName = "Chart.Bar"

export { BarChart, type BarChartProps }
