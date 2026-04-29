  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CursorDefaultSolid from "../cursor-default-solid"

  describe("CursorDefaultSolid", () => {
    it("should render the icon without errors", async () => {
      render(<CursorDefaultSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })