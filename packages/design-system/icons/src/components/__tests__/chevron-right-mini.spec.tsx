  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronRightMini from "../chevron-right-mini"

  describe("ChevronRightMini", () => {
    it("should render the icon without errors", async () => {
      render(<ChevronRightMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })