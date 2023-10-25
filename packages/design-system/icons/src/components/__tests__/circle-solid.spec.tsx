  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CircleSolid from "../circle-solid"

  describe("CircleSolid", () => {
    it("should render without crashing", async () => {
      render(<CircleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })