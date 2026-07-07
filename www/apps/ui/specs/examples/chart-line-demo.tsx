import { Chart } from "@medusajs/ui"

const data = [
  { month: "Jan", revenue: 4200, orders: 120 },
  { month: "Feb", revenue: 5100, orders: 148 },
  { month: "Mar", revenue: 4800, orders: 135 },
  { month: "Apr", revenue: 6200, orders: 170 },
  { month: "May", revenue: 5900, orders: 162 },
  { month: "Jun", revenue: 7100, orders: 195 },
]

export default function ChartLineDemo() {
  return (
    <div className="w-full">
      <Chart.Line
        data={data}
        index="month"
        categories={["revenue", "orders"]}
      />
    </div>
  )
}
