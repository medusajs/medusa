  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import MediaStopSolid from "../media-stop-solid"

  describe("MediaStopSolid", () => {
    it("should render the icon without errors", async () => {
      render(<MediaStopSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })