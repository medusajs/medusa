  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Plus from "../plus"

  describe("Plus", () => {
    it("should render without crashing", async () => {
      render(<Plus data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })