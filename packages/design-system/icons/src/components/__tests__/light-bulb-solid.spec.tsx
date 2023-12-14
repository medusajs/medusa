  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import LightBulbSolid from "../light-bulb-solid"

  describe("LightBulbSolid", () => {
    it("should render without crashing", async () => {
      render(<LightBulbSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })