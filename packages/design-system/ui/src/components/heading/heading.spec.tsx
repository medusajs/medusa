import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Heading } from "./heading"

describe("Heading", () => {
  it("should render a h1 successfully", async () => {
    render(<Heading>Header</Heading>)
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
  })

  it("should render a h2 successfully", async () => {
    render(<Heading level="h2">Header</Heading>)
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument()
  })

  it("should render a h3 successfully", async () => {
    render(<Heading level="h3">Header</Heading>)
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument()
  })
})
