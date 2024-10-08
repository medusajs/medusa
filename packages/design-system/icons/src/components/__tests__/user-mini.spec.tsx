  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import UserMini from "../user-mini"

  describe("UserMini", () => {
    it("should render the icon without errors", async () => {
      render(<UserMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })