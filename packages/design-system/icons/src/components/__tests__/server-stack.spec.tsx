  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ServerStack from "../server-stack"

  describe("ServerStack", () => {
    it("should render without crashing", async () => {
      render(<ServerStack data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })