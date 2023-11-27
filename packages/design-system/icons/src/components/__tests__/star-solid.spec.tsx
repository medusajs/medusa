  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import StarSolid from "../star-solid"

  describe("StarSolid", () => {
    it("should render without crashing", async () => {
      render(<StarSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })