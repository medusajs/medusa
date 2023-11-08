  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import DotsSix from "../dots-six"

  describe("DotsSix", () => {
    it("should render without crashing", async () => {
      render(<DotsSix data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })