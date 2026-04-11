  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import File from "../file"

  describe("File", () => {
    it("should render the icon without errors", async () => {
      render(<File data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })