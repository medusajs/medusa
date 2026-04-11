  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Gap from "../gap"

  describe("Gap", () => {
    it("should render the icon without errors", async () => {
      render(<Gap data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })