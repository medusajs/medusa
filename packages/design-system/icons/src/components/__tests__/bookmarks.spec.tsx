  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Bookmarks from "../bookmarks"

  describe("Bookmarks", () => {
    it("should render the icon without errors", async () => {
      render(<Bookmarks data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })