import { render, screen } from "@testing-library/react"
import * as React from "react"

import { Badge } from "./badge"

describe("Badge", () => {
  it("should render", async () => {
    render(<Badge>Badge</Badge>)
    expect(screen.getByText("Badge")).toBeInTheDocument()
  })

  it("should render as child", async () => {
    render(
      <Badge asChild>
        <a href="#">Changelog</a>
      </Badge>
    )

    expect(screen.getByRole("link")).toBeInTheDocument()
  })
})
