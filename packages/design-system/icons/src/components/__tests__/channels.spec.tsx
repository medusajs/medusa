  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Channels from "../channels"

  describe("Channels", () => {
    it("should render the icon without errors", async () => {
      render(<Channels data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })