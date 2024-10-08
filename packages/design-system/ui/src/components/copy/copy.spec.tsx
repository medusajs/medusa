import { render, screen } from "@testing-library/react"
import * as React from "react"

import { TooltipProvider } from "../tooltip"
import { Copy } from "./copy"

describe("Copy", () => {
  it("should render", () => {
    render(<TooltipProvider><Copy content="Hello world" /></TooltipProvider>)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })
})
