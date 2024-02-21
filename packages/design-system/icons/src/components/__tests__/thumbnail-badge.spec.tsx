  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ThumbnailBadge from "../thumbnail-badge"

  describe("ThumbnailBadge", () => {
    it("should render the icon without errors", async () => {
      render(<ThumbnailBadge data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })