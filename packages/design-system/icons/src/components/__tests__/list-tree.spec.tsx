  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ListTree from "../list-tree"

  describe("ListTree", () => {
    it("should render the icon without errors", async () => {
      render(<ListTree data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })