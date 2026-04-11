  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Code from "../code"

  describe("Code", () => {
    it("should render the icon without errors", async () => {
      render(<Code data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })