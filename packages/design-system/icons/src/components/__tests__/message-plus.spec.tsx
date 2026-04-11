  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MessagePlus from "../message-plus"

  describe("MessagePlus", () => {
    it("should render the icon without errors", async () => {
      render(<MessagePlus data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })