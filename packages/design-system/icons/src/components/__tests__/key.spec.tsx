  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Key from "../key"

  describe("Key", () => {
    it("should render without crashing", async () => {
      render(<Key data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })