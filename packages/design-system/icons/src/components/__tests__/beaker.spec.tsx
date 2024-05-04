  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Beaker from "../beaker"

  describe("Beaker", () => {
    it("should render the icon without errors", async () => {
      render(<Beaker data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })