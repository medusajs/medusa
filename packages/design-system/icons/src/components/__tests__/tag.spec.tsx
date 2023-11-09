  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Tag from "../tag"

  describe("Tag", () => {
    it("should render without crashing", async () => {
      render(<Tag data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })