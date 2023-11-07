  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import UserGroup from "../user-group"

  describe("UserGroup", () => {
    it("should render without crashing", async () => {
      render(<UserGroup data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })