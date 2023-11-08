  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CommandLineSolid from "../command-line-solid"

  describe("CommandLineSolid", () => {
    it("should render without crashing", async () => {
      render(<CommandLineSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })