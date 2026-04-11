  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import LaptopMobile from "../laptop-mobile"

  describe("LaptopMobile", () => {
    it("should render the icon without errors", async () => {
      render(<LaptopMobile data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })