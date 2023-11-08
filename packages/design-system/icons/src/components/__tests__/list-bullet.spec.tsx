  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ListBullet from "../list-bullet"

  describe("ListBullet", () => {
    it("should render without crashing", async () => {
      render(<ListBullet data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })