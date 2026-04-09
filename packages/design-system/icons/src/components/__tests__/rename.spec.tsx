  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Rename from "../rename"

  describe("Rename", () => {
    it("should render the icon without errors", async () => {
      render(<Rename data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })