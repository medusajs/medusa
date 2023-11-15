  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CloudArrowUp from "../cloud-arrow-up"

  describe("CloudArrowUp", () => {
    it("should render without crashing", async () => {
      render(<CloudArrowUp data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })