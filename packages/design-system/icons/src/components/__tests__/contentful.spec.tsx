  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Contentful from "../contentful"

  describe("Contentful", () => {
    it("should render the icon without errors", async () => {
      render(<Contentful data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })