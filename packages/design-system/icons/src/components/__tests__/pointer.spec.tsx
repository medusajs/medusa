  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Pointer from "../pointer"

  describe("Pointer", () => {
    it("should render the icon without errors", async () => {
      render(<Pointer data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })