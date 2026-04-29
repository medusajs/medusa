  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TelescopeSolid from "../telescope-solid"

  describe("TelescopeSolid", () => {
    it("should render the icon without errors", async () => {
      render(<TelescopeSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })