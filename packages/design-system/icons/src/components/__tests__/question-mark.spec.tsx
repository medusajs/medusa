  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import QuestionMark from "../question-mark"

  describe("QuestionMark", () => {
    it("should render the icon without errors", async () => {
      render(<QuestionMark data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })