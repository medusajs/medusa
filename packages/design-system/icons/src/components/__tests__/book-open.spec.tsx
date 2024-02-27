  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import BookOpen from "../book-open"

  describe("BookOpen", () => {
    it("should render the icon without errors", async () => {
      render(<BookOpen data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })