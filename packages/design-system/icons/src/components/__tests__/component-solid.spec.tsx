  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ComponentSolid from "../component-solid"

  describe("ComponentSolid", () => {
    it("should render without crashing", async () => {
      render(<ComponentSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })