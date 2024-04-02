  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import VerifiedBadge from "../verified-badge"

  describe("VerifiedBadge", () => {
    it("should render the icon without errors", async () => {
      render(<VerifiedBadge data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })