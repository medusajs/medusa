  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import FolderIllustration from "../folder-illustration"

  describe("FolderIllustration", () => {
    it("should render the icon without errors", async () => {
      render(<FolderIllustration data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })