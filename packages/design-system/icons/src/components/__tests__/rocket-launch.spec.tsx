  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import RocketLaunch from "../rocket-launch"

  describe("RocketLaunch", () => {
    it("should render without crashing", async () => {
      render(<RocketLaunch data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })