  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import AcademicCap from "../academic-cap"

  describe("AcademicCap", () => {
    it("should render without crashing", async () => {
      render(<AcademicCap data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })