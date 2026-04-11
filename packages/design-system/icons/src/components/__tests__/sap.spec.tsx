  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Sap from "../sap"

  describe("Sap", () => {
    it("should render the icon without errors", async () => {
      render(<Sap data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })