  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import KeySolid from "../key-solid"

  describe("KeySolid", () => {
    it("should render without crashing", async () => {
      render(<KeySolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })