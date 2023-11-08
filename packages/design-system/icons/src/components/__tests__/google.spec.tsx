  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Google from "../google"

  describe("Google", () => {
    it("should render without crashing", async () => {
      render(<Google data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })