  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import PointerCircleSolid from "../pointer-circle-solid"

  describe("PointerCircleSolid", () => {
    it("should render the icon without errors", async () => {
      render(<PointerCircleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })