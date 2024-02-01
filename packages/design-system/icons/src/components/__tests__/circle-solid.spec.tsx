  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleSolid from "../circle-solid"

  describe("CircleSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CircleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })