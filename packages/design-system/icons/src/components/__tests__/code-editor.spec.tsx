  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CodeEditor from "../code-editor"

  describe("CodeEditor", () => {
    it("should render the icon without errors", async () => {
      render(<CodeEditor data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })