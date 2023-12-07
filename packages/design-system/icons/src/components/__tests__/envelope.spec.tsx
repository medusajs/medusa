  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Envelope from "../envelope"

  describe("Envelope", () => {
    it("should render without crashing", async () => {
      render(<Envelope data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })