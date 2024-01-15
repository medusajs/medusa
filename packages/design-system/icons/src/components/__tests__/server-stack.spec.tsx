  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ServerStack from "../server-stack"

  describe("ServerStack", () => {
    it("should render the icon without errors", async () => {
      render(<ServerStack data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })