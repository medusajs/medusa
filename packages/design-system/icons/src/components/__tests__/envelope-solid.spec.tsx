  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EnvelopeSolid from "../envelope-solid"

  describe("EnvelopeSolid", () => {
    it("should render without crashing", async () => {
      render(<EnvelopeSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })