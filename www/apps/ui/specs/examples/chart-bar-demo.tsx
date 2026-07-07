import { Chart } from "@medusajs/ui"

const data = [
  { quarter: "Q1", sales: 1200, returns: 90 },
  { quarter: "Q2", sales: 1450, returns: 110 },
  { quarter: "Q3", sales: 1320, returns: 85 },
  { quarter: "Q4", sales: 1780, returns: 130 },
]

export default function ChartBarDemo() {
  return (
    <div className="w-full">
      <Chart.Bar
        data={data}
        index="quarter"
        categories={["sales", "returns"]}
      />
    </div>
  )
}
