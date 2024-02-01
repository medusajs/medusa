  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SparklesMiniSolid from "../sparkles-mini-solid"

  describe("SparklesMiniSolid", () => {
    it("should render the icon without errors", async () => {
      render(<SparklesMiniSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })