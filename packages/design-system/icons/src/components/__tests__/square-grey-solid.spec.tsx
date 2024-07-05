  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SquareGreySolid from "../square-grey-solid"

  describe("SquareGreySolid", () => {
    it("should render the icon without errors", async () => {
      render(<SquareGreySolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })