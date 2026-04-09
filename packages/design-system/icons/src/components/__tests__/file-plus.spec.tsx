  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import FilePlus from "../file-plus"

  describe("FilePlus", () => {
    it("should render the icon without errors", async () => {
      render(<FilePlus data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })