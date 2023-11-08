  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import XCircleSolid from "../x-circle-solid"

  describe("XCircleSolid", () => {
    it("should render without crashing", async () => {
      render(<XCircleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })