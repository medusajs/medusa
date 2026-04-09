  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import FloppyDisk from "../floppy-disk"

  describe("FloppyDisk", () => {
    it("should render the icon without errors", async () => {
      render(<FloppyDisk data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })