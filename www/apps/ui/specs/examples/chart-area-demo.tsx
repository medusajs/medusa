import { Chart } from "@medusajs/ui"

const data = [
  { date: "Mon", visitors: 320 },
  { date: "Tue", visitors: 410 },
  { date: "Wed", visitors: 380 },
  { date: "Thu", visitors: 520 },
  { date: "Fri", visitors: 610 },
  { date: "Sat", visitors: 450 },
  { date: "Sun", visitors: 390 },
]

export default function ChartAreaDemo() {
  return (
    <div className="w-full">
      <Chart.Area data={data} index="date" categories={["visitors"]} />
    </div>
  )
}
