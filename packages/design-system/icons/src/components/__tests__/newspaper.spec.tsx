  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Newspaper from "../newspaper"

  describe("Newspaper", () => {
    it("should render the icon without errors", async () => {
      render(<Newspaper data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })