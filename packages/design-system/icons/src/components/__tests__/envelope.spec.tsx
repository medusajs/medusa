  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Envelope from "../envelope"

  describe("Envelope", () => {
    it("should render the icon without errors", async () => {
      render(<Envelope data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })