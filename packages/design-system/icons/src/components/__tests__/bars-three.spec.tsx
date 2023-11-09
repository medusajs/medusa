  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import BarsThree from "../bars-three"

  describe("BarsThree", () => {
    it("should render without crashing", async () => {
      render(<BarsThree data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })