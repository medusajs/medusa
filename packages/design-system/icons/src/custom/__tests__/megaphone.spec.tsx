  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Megaphone from "../megaphone"

  describe("Megaphone", () => {
    it("should render the icon without errors", async () => {
      render(<Megaphone data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })