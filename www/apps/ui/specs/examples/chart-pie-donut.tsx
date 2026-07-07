import { Chart } from "@medusajs/ui"

const data = [
  { name: "Credit Card", value: 540 },
  { name: "PayPal", value: 320 },
  { name: "Bank Transfer", value: 180 },
]

export default function ChartPieDonut() {
  return (
    <div className="w-full">
      <Chart.Pie
        data={data}
        index="name"
        category="value"
        donut
      />
    </div>
  )
}
