  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CloudArrowDown from "../cloud-arrow-down"

  describe("CloudArrowDown", () => {
    it("should render without crashing", async () => {
      render(<CloudArrowDown data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })