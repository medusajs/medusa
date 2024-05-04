  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ChannelsSolid from "../channels-solid"

  describe("ChannelsSolid", () => {
    it("should render the icon without errors", async () => {
      render(<ChannelsSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })