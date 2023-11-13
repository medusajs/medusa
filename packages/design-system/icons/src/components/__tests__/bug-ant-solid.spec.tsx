  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import BugAntSolid from "../bug-ant-solid"

  describe("BugAntSolid", () => {
    it("should render without crashing", async () => {
      render(<BugAntSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })