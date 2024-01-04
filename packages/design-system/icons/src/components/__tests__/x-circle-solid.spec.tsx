  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import XCircleSolid from "../x-circle-solid"

  describe("XCircleSolid", () => {
    it("should render the icon without errors", async () => {
      render(<XCircleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })