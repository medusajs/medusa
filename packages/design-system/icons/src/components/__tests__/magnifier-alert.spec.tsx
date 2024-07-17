  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MagnifierAlert from "../magnifier-alert"

  describe("MagnifierAlert", () => {
    it("should render the icon without errors", async () => {
      render(<MagnifierAlert data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })