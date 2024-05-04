  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CheckCircleSolid from "../check-circle-solid"

  describe("CheckCircleSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CheckCircleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })