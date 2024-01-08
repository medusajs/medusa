  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Component from "../component"

  describe("Component", () => {
    it("should render the icon without errors", async () => {
      render(<Component data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })