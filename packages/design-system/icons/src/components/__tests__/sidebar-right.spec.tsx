  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import SidebarRight from "../sidebar-right"

  describe("SidebarRight", () => {
    it("should render the icon without errors", async () => {
      render(<SidebarRight data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })