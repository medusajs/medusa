  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Linkedin from "../linkedin"

  describe("Linkedin", () => {
    it("should render without crashing", async () => {
      render(<Linkedin data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })