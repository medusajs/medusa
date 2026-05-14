  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Equals from "../equals"

  describe("Equals", () => {
    it("should render the icon without errors", async () => {
      render(<Equals data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })