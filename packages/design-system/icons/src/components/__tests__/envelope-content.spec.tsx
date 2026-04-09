  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EnvelopeContent from "../envelope-content"

  describe("EnvelopeContent", () => {
    it("should render the icon without errors", async () => {
      render(<EnvelopeContent data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })