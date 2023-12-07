  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import XMark from "../x-mark"

  describe("XMark", () => {
    it("should render without crashing", async () => {
      render(<XMark data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })