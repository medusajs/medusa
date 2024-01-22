  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Lifebuoy from "../lifebuoy"

  describe("Lifebuoy", () => {
    it("should render the icon without errors", async () => {
      render(<Lifebuoy data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })