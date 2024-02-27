  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CheckMini from "../check-mini"

  describe("CheckMini", () => {
    it("should render the icon without errors", async () => {
      render(<CheckMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })