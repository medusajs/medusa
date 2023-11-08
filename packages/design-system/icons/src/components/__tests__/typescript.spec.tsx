  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Typescript from "../typescript"

  describe("Typescript", () => {
    it("should render without crashing", async () => {
      render(<Typescript data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })