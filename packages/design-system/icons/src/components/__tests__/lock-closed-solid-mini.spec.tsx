  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import LockClosedSolidMini from "../lock-closed-solid-mini"

  describe("LockClosedSolidMini", () => {
    it("should render the icon without errors", async () => {
      render(<LockClosedSolidMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })