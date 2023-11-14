  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import RocketLaunchSolid from "../rocket-launch-solid"

  describe("RocketLaunchSolid", () => {
    it("should render without crashing", async () => {
      render(<RocketLaunchSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })