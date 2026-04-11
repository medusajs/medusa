  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleInfoSolid from "../circle-info-solid"

  describe("CircleInfoSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CircleInfoSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })