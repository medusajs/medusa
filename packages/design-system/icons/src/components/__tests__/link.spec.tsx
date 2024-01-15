  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Link from "../link"

  describe("Link", () => {
    it("should render the icon without errors", async () => {
      render(<Link data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })