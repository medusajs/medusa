  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Facebook from "../facebook"

  describe("Facebook", () => {
    it("should render the icon without errors", async () => {
      render(<Facebook data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })