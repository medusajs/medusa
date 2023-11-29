  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import Server from "../server"

  describe("Server", () => {
    it("should render without crashing", async () => {
      render(<Server data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })