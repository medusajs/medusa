  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SparklesSolid from "../sparkles-solid"

  describe("SparklesSolid", () => {
    it("should render the icon without errors", async () => {
      render(<SparklesSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })