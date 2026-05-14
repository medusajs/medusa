  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Image from "../image"

  describe("Image", () => {
    it("should render the icon without errors", async () => {
      render(<Image data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })