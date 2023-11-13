  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Phone from "../phone"

  describe("Phone", () => {
    it("should render without crashing", async () => {
      render(<Phone data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })