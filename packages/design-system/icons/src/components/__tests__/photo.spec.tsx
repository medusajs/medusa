  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Photo from "../photo"

  describe("Photo", () => {
    it("should render without crashing", async () => {
      render(<Photo data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })