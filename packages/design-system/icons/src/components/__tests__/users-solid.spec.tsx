  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import UsersSolid from "../users-solid"

  describe("UsersSolid", () => {
    it("should render without crashing", async () => {
      render(<UsersSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })