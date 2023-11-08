  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CheckMini from "../check-mini"

  describe("CheckMini", () => {
    it("should render without crashing", async () => {
      render(<CheckMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })