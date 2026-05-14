  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Language from "../language"

  describe("Language", () => {
    it("should render the icon without errors", async () => {
      render(<Language data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })