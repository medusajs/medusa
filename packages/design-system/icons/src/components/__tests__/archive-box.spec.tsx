  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ArchiveBox from "../archive-box"

  describe("ArchiveBox", () => {
    it("should render the icon without errors", async () => {
      render(<ArchiveBox data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })