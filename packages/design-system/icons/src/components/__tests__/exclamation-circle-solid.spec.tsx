  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ExclamationCircleSolid from "../exclamation-circle-solid"

  describe("ExclamationCircleSolid", () => {
    it("should render without crashing", async () => {
      render(<ExclamationCircleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })