  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import XMarkMini from "../x-mark-mini"

  describe("XMarkMini", () => {
    it("should render the icon without errors", async () => {
      render(<XMarkMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })