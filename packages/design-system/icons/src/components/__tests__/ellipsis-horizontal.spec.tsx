  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EllipsisHorizontal from "../ellipsis-horizontal"

  describe("EllipsisHorizontal", () => {
    it("should render without crashing", async () => {
      render(<EllipsisHorizontal data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })