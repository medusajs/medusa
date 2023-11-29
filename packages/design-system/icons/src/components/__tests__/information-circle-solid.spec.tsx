  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import InformationCircleSolid from "../information-circle-solid"

  describe("InformationCircleSolid", () => {
    it("should render without crashing", async () => {
      render(<InformationCircleSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })