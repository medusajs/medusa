  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import XCircle from "../x-circle"

  describe("XCircle", () => {
    it("should render the icon without errors", async () => {
      render(<XCircle data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })