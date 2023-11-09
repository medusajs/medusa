  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import GiftSolid from "../gift-solid"

  describe("GiftSolid", () => {
    it("should render without crashing", async () => {
      render(<GiftSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })