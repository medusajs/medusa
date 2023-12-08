  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import LockClosedSolid from "../lock-closed-solid"

  describe("LockClosedSolid", () => {
    it("should render without crashing", async () => {
      render(<LockClosedSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })