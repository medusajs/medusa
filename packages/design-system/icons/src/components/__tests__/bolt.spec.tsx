  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Bolt from "../bolt"

  describe("Bolt", () => {
    it("should render the icon without errors", async () => {
      render(<Bolt data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })