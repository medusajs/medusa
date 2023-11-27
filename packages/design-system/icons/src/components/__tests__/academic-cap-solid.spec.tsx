  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import AcademicCapSolid from "../academic-cap-solid"

  describe("AcademicCapSolid", () => {
    it("should render without crashing", async () => {
      render(<AcademicCapSolid data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })