  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Bolt from "../bolt"

  describe("Bolt", () => {
    it("should render without crashing", async () => {
      render(<Bolt data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })