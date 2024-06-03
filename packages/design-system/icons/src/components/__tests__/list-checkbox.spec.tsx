  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ListCheckbox from "../list-checkbox"

  describe("ListCheckbox", () => {
    it("should render the icon without errors", async () => {
      render(<ListCheckbox data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })