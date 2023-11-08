  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CheckCircleMiniSolid from "../check-circle-mini-solid"

  describe("CheckCircleMiniSolid", () => {
    it("should render without crashing", async () => {
      render(<CheckCircleMiniSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })