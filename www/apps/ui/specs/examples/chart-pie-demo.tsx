import { Chart } from "@medusajs/ui"

const data = [
  { name: "Electronics", value: 400 },
  { name: "Apparel", value: 300 },
  { name: "Home", value: 220 },
  { name: "Beauty", value: 140 },
]

export default function ChartPieDemo() {
  return (
    <div className="w-full">
      <Chart.Pie data={data} index="name" category="value" />
    </div>
  )
}
