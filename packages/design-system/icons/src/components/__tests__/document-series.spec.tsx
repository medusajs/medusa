  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import DocumentSeries from "../document-series"

  describe("DocumentSeries", () => {
    it("should render the icon without errors", async () => {
      render(<DocumentSeries data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })