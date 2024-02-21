  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import FolderOpenIllustration from "../folder-open-illustration"

  describe("FolderOpenIllustration", () => {
    it("should render the icon without errors", async () => {
      render(<FolderOpenIllustration data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })