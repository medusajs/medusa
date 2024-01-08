  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Sidebar from "../sidebar"

  describe("Sidebar", () => {
    it("should render the icon without errors", async () => {
      render(<Sidebar data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })