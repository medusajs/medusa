  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Slack from "../slack"

  describe("Slack", () => {
    it("should render the icon without errors", async () => {
      render(<Slack data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })