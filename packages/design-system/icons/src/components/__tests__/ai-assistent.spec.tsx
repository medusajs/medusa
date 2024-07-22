  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import AiAssistent from "../ai-assistent"

  describe("AiAssistent", () => {
    it("should render the icon without errors", async () => {
      render(<AiAssistent data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })