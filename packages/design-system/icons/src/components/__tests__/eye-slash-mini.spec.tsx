  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EyeSlashMini from "../eye-slash-mini"

  describe("EyeSlashMini", () => {
    it("should render without crashing", async () => {
      render(<EyeSlashMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })