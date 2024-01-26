  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Typescript from "../typescript"

  describe("Typescript", () => {
    it("should render the icon without errors", async () => {
      render(<Typescript data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })