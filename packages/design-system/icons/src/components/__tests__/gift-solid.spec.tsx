  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import GiftSolid from "../gift-solid"

  describe("GiftSolid", () => {
    it("should render the icon without errors", async () => {
      render(<GiftSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })