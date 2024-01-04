  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Vercel from "../vercel"

  describe("Vercel", () => {
    it("should render without crashing", async () => {
      render(<Vercel data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })