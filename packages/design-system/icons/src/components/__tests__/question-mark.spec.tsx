  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import QuestionMark from "../question-mark"

  describe("QuestionMark", () => {
    it("should render without crashing", async () => {
      render(<QuestionMark data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })