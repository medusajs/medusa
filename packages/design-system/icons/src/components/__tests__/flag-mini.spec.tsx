  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import FlagMini from "../flag-mini"

  describe("FlagMini", () => {
    it("should render the icon without errors", async () => {
      render(<FlagMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })