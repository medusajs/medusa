  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Pencil from "../pencil"

  describe("Pencil", () => {
    it("should render the icon without errors", async () => {
      render(<Pencil data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })