  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CubeSolid from "../cube-solid"

  describe("CubeSolid", () => {
    it("should render without crashing", async () => {
      render(<CubeSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })