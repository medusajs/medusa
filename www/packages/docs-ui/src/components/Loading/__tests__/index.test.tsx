import React from "react"
import { describe, expect, test } from "vitest"
import { render } from "@testing-library/react"

import { Loading } from "../../Loading"

describe("rendering", () => {
  test("renders with default count", () => {
    const { container } = render(<Loading />)
    const loading = container.querySelector("span[role='status']")
    expect(loading).toBeInTheDocument()
    const bars = container.querySelectorAll("span.bg-medusa-bg-subtle-pressed")
    expect(bars).toHaveLength(6)
  })

  test("renders with custom count", () => {
    const { container } = render(<Loading count={3} />)
    const bars = container.querySelectorAll("span.bg-medusa-bg-subtle-pressed")
    expect(bars).toHaveLength(3)
  })

  test("renders with count of 0", () => {
    const { container } = render(<Loading count={0} />)
    const bars = container.querySelectorAll("span.bg-medusa-bg-subtle-pressed")
    expect(bars).toHaveLength(0)
  })

  test("applies custom className", () => {
    const { container } = render(<Loading className="custom-class" />)
    const loading = container.querySelector("span[role='status']")
    expect(loading).toHaveClass("custom-class")
  })

  test("applies custom barClassName", () => {
    const { container } = render(<Loading barClassName="custom-bar-class" />)
    const bars = container.querySelectorAll("span.bg-medusa-bg-subtle-pressed")
    bars.forEach((bar) => {
      expect(bar).toHaveClass("custom-bar-class")
    })
  })

  test("has accessibility attributes", () => {
    const { container } = render(<Loading />)
    const loading = container.querySelector("span[role='status']")
    expect(loading).toHaveAttribute("role", "status")
    const srOnly = container.querySelector(".sr-only")
    expect(srOnly).toBeInTheDocument()
    expect(srOnly).toHaveTextContent("Loading...")
  })
})
