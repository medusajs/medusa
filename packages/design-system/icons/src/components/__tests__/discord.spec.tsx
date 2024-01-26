  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Discord from "../discord"

  describe("Discord", () => {
    it("should render the icon without errors", async () => {
      render(<Discord data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })