  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Github from "../github"

  describe("Github", () => {
    it("should render without crashing", async () => {
      render(<Github data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })