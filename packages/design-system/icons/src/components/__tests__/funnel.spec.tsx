  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Funnel from "../funnel"

  describe("Funnel", () => {
    it("should render without crashing", async () => {
      render(<Funnel data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })