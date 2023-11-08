  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Component from "../component"

  describe("Component", () => {
    it("should render without crashing", async () => {
      render(<Component data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })