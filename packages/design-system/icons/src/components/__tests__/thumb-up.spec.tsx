  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ThumbUp from "../thumb-up"

  describe("ThumbUp", () => {
    it("should render without crashing", async () => {
      render(<ThumbUp data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })