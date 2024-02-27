  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Meta from "../meta"

  describe("Meta", () => {
    it("should render the icon without errors", async () => {
      render(<Meta data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })