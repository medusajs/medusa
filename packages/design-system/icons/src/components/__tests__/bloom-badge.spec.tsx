  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import BloomBadge from "../bloom-badge"

  describe("BloomBadge", () => {
    it("should render the icon without errors", async () => {
      render(<BloomBadge data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })