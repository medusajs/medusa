export type ChartColor = "blue" | "green" | "red" | "orange" | "purple" | "grey"

export const DEFAULT_CHART_COLORS: ChartColor[] = [
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "grey",
]

export const chartColorMap: Record<ChartColor, string> = {
  blue: "var(--tag-blue-icon)",
  green: "var(--tag-green-icon)",
  red: "var(--tag-red-icon)",
  orange: "var(--tag-orange-icon)",
  purple: "var(--tag-purple-icon)",
  grey: "var(--tag-neutral-icon)",
}

export function resolveColors(
  categories: string[],
  colors?: ChartColor[]
): string[] {
  return categories.map((_, i) => {
    const color = colors?.[i] ?? DEFAULT_CHART_COLORS[i % DEFAULT_CHART_COLORS.length]
    return chartColorMap[color]
  })
}

export interface CartesianChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of data objects to render.
   */
  data: Record<string, unknown>[]
  /**
   * The key in data objects to use for the x-axis.
   */
  index: string
  /**
   * The keys in data objects to render as data series.
   */
  categories: string[]
  /**
   * Override the default color palette.
   */
  colors?: ChartColor[]
  /**
   * The height of the chart in pixels.
   */
  height?: number
  /**
   * Whether to show the legend.
   */
  showLegend?: boolean
  /**
   * Whether to show the grid lines.
   */
  showGrid?: boolean
  /**
   * Whether to show the tooltip on hover.
   */
  showTooltip?: boolean
  /**
   * Whether to show the x-axis.
   */
  showXAxis?: boolean
  /**
   * Whether to show the y-axis.
   */
  showYAxis?: boolean
  /**
   * A function to format the displayed values.
   */
  valueFormatter?: (value: number) => string
}

export interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of data objects to render.
   */
  data: Record<string, unknown>[]
  /**
   * The key in data objects for the numeric value.
   */
  category: string
  /**
   * The key in data objects for the label.
   */
  index: string
  /**
   * Override the default color palette.
   */
  colors?: ChartColor[]
  /**
   * The height of the chart in pixels.
   */
  height?: number
  /**
   * Whether to render as a donut chart.
   */
  donut?: boolean
  /**
   * Whether to show the legend.
   */
  showLegend?: boolean
  /**
   * Whether to show the tooltip on hover.
   */
  showTooltip?: boolean
  /**
   * A function to format the displayed values.
   */
  valueFormatter?: (value: number) => string
}
