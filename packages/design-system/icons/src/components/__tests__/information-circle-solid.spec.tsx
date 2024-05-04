  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import InformationCircleSolid from "../information-circle-solid"

  describe("InformationCircleSolid", () => {
    it("should render the icon without errors", async () => {
      render(<InformationCircleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })