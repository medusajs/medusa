  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import QueueList from "../queue-list"

  describe("QueueList", () => {
    it("should render the icon without errors", async () => {
      render(<QueueList data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })