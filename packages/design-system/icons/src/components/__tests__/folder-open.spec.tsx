  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import FolderOpen from "../folder-open"

  describe("FolderOpen", () => {
    it("should render without crashing", async () => {
      render(<FolderOpen data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })