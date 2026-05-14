import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
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

interface AreaChartProps extends CartesianChartProps {
  /**
   * Whether to stack the areas.
   */
  stacked?: boolean
  /**
   * Whether to show a gradient fill.
   */
  gradient?: boolean
}

/**
 * An area chart component for visualizing volume and trends.
 */
const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
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
      gradient = true,
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
          <RechartsAreaChart data={data}>
            <defs>
              {categories.map((category, i) => (
                <linearGradient
                  key={category}
                  id={`gradient-${category}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={resolvedColors[i]}
                    stopOpacity={gradient ? 0.3 : 0.1}
                  />
                  <stop
                    offset="100%"
                    stopColor={resolvedColors[i]}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
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
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stroke={resolvedColors[i]}
                strokeWidth={2}
                fill={`url(#gradient-${category})`}
                stackId={stacked ? "stack" : undefined}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
)
AreaChart.displayName = "Chart.Area"

export { AreaChart, type AreaChartProps }
