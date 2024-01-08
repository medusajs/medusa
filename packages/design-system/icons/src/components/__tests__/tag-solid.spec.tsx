  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import TagSolid from "../tag-solid"

  describe("TagSolid", () => {
    it("should render the icon without errors", async () => {
      render(<TagSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })