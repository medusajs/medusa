  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ToolsSolid from "../tools-solid"

  describe("ToolsSolid", () => {
    it("should render without crashing", async () => {
      render(<ToolsSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })