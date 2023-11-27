  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Rss from "../rss"

  describe("Rss", () => {
    it("should render without crashing", async () => {
      render(<Rss data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })