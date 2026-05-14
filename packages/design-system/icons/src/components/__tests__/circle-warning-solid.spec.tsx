  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleWarningSolid from "../circle-warning-solid"

  describe("CircleWarningSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CircleWarningSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })