  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Channels from "../channels"

  describe("Channels", () => {
    it("should render without crashing", async () => {
      render(<Channels data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })