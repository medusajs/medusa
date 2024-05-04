  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import InformationCircle from "../information-circle"

  describe("InformationCircle", () => {
    it("should render the icon without errors", async () => {
      render(<InformationCircle data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })