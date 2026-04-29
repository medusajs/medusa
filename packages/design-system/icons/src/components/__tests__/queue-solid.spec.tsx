  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import QueueSolid from "../queue-solid"

  describe("QueueSolid", () => {
    it("should render the icon without errors", async () => {
      render(<QueueSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })