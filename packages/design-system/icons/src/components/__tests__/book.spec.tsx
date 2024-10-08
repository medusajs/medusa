  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Book from "../book"

  describe("Book", () => {
    it("should render the icon without errors", async () => {
      render(<Book data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })