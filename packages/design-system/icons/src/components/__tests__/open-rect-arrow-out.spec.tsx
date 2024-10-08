  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import OpenRectArrowOut from "../open-rect-arrow-out"

  describe("OpenRectArrowOut", () => {
    it("should render the icon without errors", async () => {
      render(<OpenRectArrowOut data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })