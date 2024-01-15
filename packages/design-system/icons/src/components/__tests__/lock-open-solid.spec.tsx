  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import LockOpenSolid from "../lock-open-solid"

  describe("LockOpenSolid", () => {
    it("should render the icon without errors", async () => {
      render(<LockOpenSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })