  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Tailwind from "../tailwind"

  describe("Tailwind", () => {
    it("should render without crashing", async () => {
      render(<Tailwind data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })