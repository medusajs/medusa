  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import FlyingBox from "../flying-box"

  describe("FlyingBox", () => {
    it("should render the icon without errors", async () => {
      render(<FlyingBox data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })