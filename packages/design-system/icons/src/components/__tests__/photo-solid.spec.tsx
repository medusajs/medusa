  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import PhotoSolid from "../photo-solid"

  describe("PhotoSolid", () => {
    it("should render without crashing", async () => {
      render(<PhotoSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })