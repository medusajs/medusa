  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import InboxSolid from "../inbox-solid"

  describe("InboxSolid", () => {
    it("should render the icon without errors", async () => {
      render(<InboxSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })