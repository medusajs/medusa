  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import CodeBranch from "../code-branch"

  describe("CodeBranch", () => {
    it("should render the icon without errors", async () => {
      render(<CodeBranch data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })