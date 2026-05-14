import { render, screen } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { Chart } from "./chart"

// recharts uses ResizeObserver internally
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

const lineData = [
  { month: "Jan", revenue: 4000, profit: 2400 },
  { month: "Feb", revenue: 3000, profit: 1398 },
  { month: "Mar", revenue: 5000, profit: 3800 },
]

const pieData = [
  { name: "A", value: 400 },
  { name: "B", value: 300 },
  { name: "C", value: 200 },
]

describe("Chart", () => {
  describe("Chart.Line", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <Chart.Line
          data={lineData}
          categories={["revenue", "profit"]}
          index="month"
        />
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with custom className", () => {
      const { container } = render(
        <Chart.Line
          data={lineData}
          categories={["revenue"]}
          index="month"
          className="custom-class"
        />
      )
      expect(container.firstChild).toHaveClass("custom-class")
    })

    it("renders with empty data", () => {
      const { container } = render(
        <Chart.Line data={[]} categories={["revenue"]} index="month" />
      )
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe("Chart.Bar", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <Chart.Bar
          data={lineData}
          categories={["revenue", "profit"]}
          index="month"
        />
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders stacked variant", () => {
      const { container } = render(
        <Chart.Bar
          data={lineData}
          categories={["revenue", "profit"]}
          index="month"
          stacked
        />
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders vertical layout", () => {
      const { container } = render(
        <Chart.Bar
          data={lineData}
          categories={["revenue"]}
          index="month"
          layout="vertical"
        />
      )
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe("Chart.Area", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <Chart.Area
          data={lineData}
          categories={["revenue", "profit"]}
          index="month"
        />
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders stacked variant", () => {
      const { container } = render(
        <Chart.Area
          data={lineData}
          categories={["revenue", "profit"]}
          index="month"
          stacked
        />
      )
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe("Chart.Pie", () => {
    it("renders without crashing", () => {
      const { container } = render(
        <Chart.Pie data={pieData} category="value" index="name" />
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders donut variant", () => {
      const { container } = render(
        <Chart.Pie data={pieData} category="value" index="name" donut />
      )
      expect(container.firstChild).toBeTruthy()
    })

    it("renders with custom colors", () => {
      const { container } = render(
        <Chart.Pie
          data={pieData}
          category="value"
          index="name"
          colors={["red", "green", "blue"]}
        />
      )
      expect(container.firstChild).toBeTruthy()
    })
  })
})
