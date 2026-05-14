import { AreaChart } from "./chart-area"
import { BarChart } from "./chart-bar"
import { LineChart } from "./chart-line"
import { PieChart } from "./chart-pie"

/**
 * Chart component with multiple visualization variants.
 *
 * @example
 * ```tsx
 * <Chart.Line data={data} categories={["revenue"]} index="month" />
 * <Chart.Bar data={data} categories={["sales"]} index="quarter" stacked />
 * <Chart.Area data={data} categories={["users"]} index="date" />
 * <Chart.Pie data={data} category="value" index="name" donut />
 * ```
 */
const Chart = Object.assign(
  {},
  {
    /**
     * A line chart for visualizing trends over time.
     */
    Line: LineChart,
    /**
     * A bar chart for comparing categorical data.
     */
    Bar: BarChart,
    /**
     * An area chart for visualizing volume and trends.
     */
    Area: AreaChart,
    /**
     * A pie/donut chart for visualizing proportions.
     */
    Pie: PieChart,
  }
)

export { Chart }
