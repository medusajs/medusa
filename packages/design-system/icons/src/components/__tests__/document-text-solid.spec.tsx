  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import DocumentTextSolid from "../document-text-solid"

  describe("DocumentTextSolid", () => {
    it("should render the icon without errors", async () => {
      render(<DocumentTextSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })