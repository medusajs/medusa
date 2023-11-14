  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import BoltSolid from "../bolt-solid"

  describe("BoltSolid", () => {
    it("should render without crashing", async () => {
      render(<BoltSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })