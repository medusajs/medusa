  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import DocumentText from "../document-text"

  describe("DocumentText", () => {
    it("should render the icon without errors", async () => {
      render(<DocumentText data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })