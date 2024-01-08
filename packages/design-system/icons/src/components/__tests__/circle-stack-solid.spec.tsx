  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleStackSolid from "../circle-stack-solid"

  describe("CircleStackSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CircleStackSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })