import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock components
vi.mock("@/components/Badge", () => ({
  Badge: () => <div>Badge</div>,
}))
vi.mock("@/components/Card/Layout/Default", () => ({
  CardDefaultLayout: () => <div>CardDefaultLayout</div>,
}))
vi.mock("@/components/Card/Layout/Large", () => ({
  CardLargeLayout: () => <div>CardLargeLayout</div>,
}))
vi.mock("@/components/Card/Layout/Filler", () => ({
  CardFillerLayout: () => <div>CardFillerLayout</div>,
}))
vi.mock("@/components/Card/Layout/Mini", () => ({
  CardLayoutMini: () => <div>CardLayoutMini</div>,
}))
vi.mock("@/components/Card/Layout/Bloom", () => ({
  CardBloomLayout: () => <div>CardBloomLayout</div>,
}))

import { Card } from "../../Card"

describe("rendering", () => {
  test("renders default card", () => {
    const { container } = render(<Card>Click me</Card>)
    expect(container).toBeInTheDocument()
    const card = container.querySelector("div")
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent("CardDefaultLayout")
  })
  test("renders large card", () => {
    const { container } = render(<Card type="large">Click me</Card>)
    expect(container).toBeInTheDocument()
    const card = container.querySelector("div")
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent("CardLargeLayout")
  })
  test("renders filler card", () => {
    const { container } = render(<Card type="filler">Click me</Card>)
    expect(container).toBeInTheDocument()
    const card = container.querySelector("div")
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent("CardFillerLayout")
  })
  test("renders mini card", () => {
    const { container } = render(<Card type="mini">Click me</Card>)
    expect(container).toBeInTheDocument()
    const card = container.querySelector("div")
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent("CardLayoutMini")
  })
  test("renders bloom card", () => {
    const { container } = render(<Card type="bloom">Click me</Card>)
    expect(container).toBeInTheDocument()
    const card = container.querySelector("div")
    expect(card).toBeInTheDocument()
    expect(card).toHaveTextContent("CardBloomLayout")
  })
})
