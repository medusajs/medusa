  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Users from "../users"

  describe("Users", () => {
    it("should render the icon without errors", async () => {
      render(<Users data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })