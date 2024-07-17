  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import AIAssistant from "../AI-ASSISTANT"

  describe("AIAssistant", () => {
    it("should render the icon without errors", async () => {
      render(<AIAssistant data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })