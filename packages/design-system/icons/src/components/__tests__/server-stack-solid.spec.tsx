  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import ServerStackSolid from "../server-stack-solid"

  describe("ServerStackSolid", () => {
    it("should render without crashing", async () => {
      render(<ServerStackSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })