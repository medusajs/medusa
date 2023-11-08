  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import BellAlertSolid from "../bell-alert-solid"

  describe("BellAlertSolid", () => {
    it("should render without crashing", async () => {
      render(<BellAlertSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })