  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import RocketLaunch from "../rocket-launch"

  describe("RocketLaunch", () => {
    it("should render the icon without errors", async () => {
      render(<RocketLaunch data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })