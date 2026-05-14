  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Mailbox from "../mailbox"

  describe("Mailbox", () => {
    it("should render the icon without errors", async () => {
      render(<Mailbox data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })