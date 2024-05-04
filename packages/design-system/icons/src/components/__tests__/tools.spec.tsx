  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Tools from "../tools"

  describe("Tools", () => {
    it("should render the icon without errors", async () => {
      render(<Tools data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })