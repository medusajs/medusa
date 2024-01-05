  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EyeMini from "../eye-mini"

  describe("EyeMini", () => {
    it("should render without crashing", async () => {
      render(<EyeMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })