  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import PencilSquareSolid from "../pencil-square-solid"

  describe("PencilSquareSolid", () => {
    it("should render the icon without errors", async () => {
      render(<PencilSquareSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })