  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import GridList from "../grid-list"

  describe("GridList", () => {
    it("should render the icon without errors", async () => {
      render(<GridList data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })