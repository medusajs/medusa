  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SparklesMini from "../sparkles-mini"

  describe("SparklesMini", () => {
    it("should render without crashing", async () => {
      render(<SparklesMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })