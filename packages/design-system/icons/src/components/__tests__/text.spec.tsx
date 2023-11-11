  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Text from "../text"

  describe("Text", () => {
    it("should render without crashing", async () => {
      render(<Text data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })