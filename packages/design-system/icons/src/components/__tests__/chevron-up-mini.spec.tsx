  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChevronUpMini from "../chevron-up-mini"

  describe("ChevronUpMini", () => {
    it("should render the icon without errors", async () => {
      render(<ChevronUpMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })