import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Copy } from "./copy"

describe("Copy", () => {
  it("should render", () => {
    render(<Copy content="Hello world" />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })
})
