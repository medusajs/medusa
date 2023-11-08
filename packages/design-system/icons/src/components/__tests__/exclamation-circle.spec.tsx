  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ExclamationCircle from "../exclamation-circle"

  describe("ExclamationCircle", () => {
    it("should render without crashing", async () => {
      render(<ExclamationCircle data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })