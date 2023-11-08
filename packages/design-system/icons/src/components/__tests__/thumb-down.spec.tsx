  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ThumbDown from "../thumb-down"

  describe("ThumbDown", () => {
    it("should render without crashing", async () => {
      render(<ThumbDown data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })