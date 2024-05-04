  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ReactJs from "../react-js"

  describe("ReactJs", () => {
    it("should render the icon without errors", async () => {
      render(<ReactJs data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })