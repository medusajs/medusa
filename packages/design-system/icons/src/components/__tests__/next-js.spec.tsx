  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import NextJs from "../next-js"

  describe("NextJs", () => {
    it("should render without crashing", async () => {
      render(<NextJs data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })