import type { Meta, StoryObj } from "@storybook/react"

import { Chart } from "./chart"

const meta: Meta = {
  title: "Components/Chart",
  parameters: {
    layout: "padded",
  },
}

export default meta

// Sample data
const monthlyData = [
  { month: "Jan", revenue: 4000, profit: 2400, expenses: 1600 },
  { month: "Feb", revenue: 3000, profit: 1398, expenses: 1602 },
  { month: "Mar", revenue: 5000, profit: 3800, expenses: 1200 },
  { month: "Apr", revenue: 4780, profit: 3908, expenses: 872 },
  { month: "May", revenue: 5890, profit: 4800, expenses: 1090 },
  { month: "Jun", revenue: 6390, profit: 5300, expenses: 1090 },
  { month: "Jul", revenue: 5490, profit: 4300, expenses: 1190 },
]

const quarterlyData = [
  { quarter: "Q1", sales: 12000, returns: 800 },
  { quarter: "Q2", sales: 15000, returns: 1200 },
  { quarter: "Q3", sales: 18000, returns: 900 },
  { quarter: "Q4", sales: 22000, returns: 1500 },
]

const pieData = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Food", value: 200 },
  { name: "Books", value: 150 },
  { name: "Other", value: 100 },
]

const currencyFormatter = (value: number) => `$${value.toLocaleString()}`

// ---- Line Chart Stories ----

export const Line: StoryObj = {
  render: () => (
    <Chart.Line
      data={monthlyData}
      categories={["revenue", "profit"]}
      index="month"
      valueFormatter={currencyFormatter}
    />
  ),
}

export const LineSingleSeries: StoryObj = {
  render: () => (
    <Chart.Line
      data={monthlyData}
      categories={["revenue"]}
      index="month"
      colors={["green"]}
      valueFormatter={currencyFormatter}
    />
  ),
}

export const LineLinear: StoryObj = {
  render: () => (
    <Chart.Line
      data={monthlyData}
      categories={["revenue", "profit"]}
      index="month"
      curveType="linear"
    />
  ),
}

export const LineStep: StoryObj = {
  render: () => (
    <Chart.Line
      data={monthlyData}
      categories={["revenue"]}
      index="month"
      curveType="step"
      colors={["purple"]}
    />
  ),
}

export const LineMinimal: StoryObj = {
  render: () => (
    <Chart.Line
      data={monthlyData}
      categories={["revenue"]}
      index="month"
      showGrid={false}
      showYAxis={false}
      showLegend={false}
    />
  ),
}

// ---- Bar Chart Stories ----

export const Bar: StoryObj = {
  render: () => (
    <Chart.Bar
      data={quarterlyData}
      categories={["sales", "returns"]}
      index="quarter"
      valueFormatter={currencyFormatter}
    />
  ),
}

export const BarStacked: StoryObj = {
  render: () => (
    <Chart.Bar
      data={monthlyData}
      categories={["profit", "expenses"]}
      index="month"
      stacked
      colors={["green", "red"]}
      valueFormatter={currencyFormatter}
    />
  ),
}

export const BarVertical: StoryObj = {
  render: () => (
    <Chart.Bar
      data={quarterlyData}
      categories={["sales"]}
      index="quarter"
      layout="vertical"
      colors={["purple"]}
      valueFormatter={currencyFormatter}
    />
  ),
}

// ---- Area Chart Stories ----

export const Area: StoryObj = {
  render: () => (
    <Chart.Area
      data={monthlyData}
      categories={["revenue", "profit"]}
      index="month"
      valueFormatter={currencyFormatter}
    />
  ),
}

export const AreaStacked: StoryObj = {
  render: () => (
    <Chart.Area
      data={monthlyData}
      categories={["profit", "expenses"]}
      index="month"
      stacked
      colors={["green", "orange"]}
      valueFormatter={currencyFormatter}
    />
  ),
}

export const AreaNoGradient: StoryObj = {
  render: () => (
    <Chart.Area
      data={monthlyData}
      categories={["revenue"]}
      index="month"
      gradient={false}
      colors={["red"]}
    />
  ),
}

// ---- Pie Chart Stories ----

export const Pie: StoryObj = {
  render: () => (
    <Chart.Pie
      data={pieData}
      category="value"
      index="name"
    />
  ),
}

export const Donut: StoryObj = {
  render: () => (
    <Chart.Pie
      data={pieData}
      category="value"
      index="name"
      donut
      valueFormatter={currencyFormatter}
    />
  ),
}

export const PieCustomColors: StoryObj = {
  render: () => (
    <Chart.Pie
      data={pieData}
      category="value"
      index="name"
      colors={["blue", "purple", "green", "orange", "red"]}
    />
  ),
}

// ---- Multi-series ----

export const ThreeSeries: StoryObj = {
  render: () => (
    <Chart.Line
      data={monthlyData}
      categories={["revenue", "profit", "expenses"]}
      index="month"
      colors={["blue", "green", "red"]}
      valueFormatter={currencyFormatter}
    />
  ),
}
