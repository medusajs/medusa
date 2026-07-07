import { Chart } from "@medusajs/ui"

const data = [
  { quarter: "Q1", online: 800, retail: 400 },
  { quarter: "Q2", online: 950, retail: 500 },
  { quarter: "Q3", online: 870, retail: 450 },
  { quarter: "Q4", online: 1180, retail: 600 },
]

export default function ChartBarStacked() {
  return (
    <div className="w-full">
      <Chart.Bar
        data={data}
        index="quarter"
        categories={["online", "retail"]}
        stacked
      />
    </div>
  )
}
