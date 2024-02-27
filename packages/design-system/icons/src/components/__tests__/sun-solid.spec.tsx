  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SunSolid from "../sun-solid"

  describe("SunSolid", () => {
    it("should render the icon without errors", async () => {
      render(<SunSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })