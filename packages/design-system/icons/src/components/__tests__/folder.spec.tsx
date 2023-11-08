  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Folder from "../folder"

  describe("Folder", () => {
    it("should render without crashing", async () => {
      render(<Folder data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })