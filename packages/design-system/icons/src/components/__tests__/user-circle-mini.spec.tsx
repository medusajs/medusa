  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import UserCircleMini from "../user-circle-mini"

  describe("UserCircleMini", () => {
    it("should render the icon without errors", async () => {
      render(<UserCircleMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })