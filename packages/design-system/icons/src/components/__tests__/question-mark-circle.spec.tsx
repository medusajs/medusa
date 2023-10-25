  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import QuestionMarkCircle from "../question-mark-circle"

  describe("QuestionMarkCircle", () => {
    it("should render without crashing", async () => {
      render(<QuestionMarkCircle data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })