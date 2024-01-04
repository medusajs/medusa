  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import EyeSlashMini from "../eye-slash-mini"

  describe("EyeSlashMini", () => {
    it("should render the icon without errors", async () => {
      render(<EyeSlashMini data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })