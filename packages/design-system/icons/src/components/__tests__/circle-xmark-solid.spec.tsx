  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleXmarkSolid from "../circle-xmark-solid"

  describe("CircleXmarkSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CircleXmarkSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })